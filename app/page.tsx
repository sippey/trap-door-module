'use client'

import { useState, useEffect } from "react";
import GameLayout from '../components/GameLayout';
import Grid from '../components/Grid';
import MainMenu from '../components/MainMenu';
import EndGameScreen from '../components/EndGameScreen';
import Leaderboard from '../components/Leaderboard';
import CaseBriefingModal from '../components/CaseBriefingModal'; // Import CaseBriefingModal
import { initialGameState, GameState, Operation, OperationType } from '../lib/gameState';
import { initializeGridWithOperations, generateEnvironmentalClue, generatePeriodicClue } from '../lib/gameUtils';
import { CASES, CaseConfig } from '../lib/cases';

const GRID_SIZE = 10;

export default function Home() {
  const LOCAL_STORAGE_KEY = 'detectiveGridGameSave';

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentCase, setCurrentCase] = useState<CaseConfig | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBriefingModal, setShowBriefingModal] = useState(false); // New state for briefing modal

  // Load game state from local storage on component mount (client-side only)
  useEffect(() => {
    try {
      const savedGameState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedGameState) {
        const parsedState: GameState = JSON.parse(savedGameState);
        setGameState(parsedState);
        const selectedCase = CASES.find(c => c.id === parsedState.currentCaseId);
        setCurrentCase(selectedCase || null);
        setGameStarted(true);
      }
    } catch (error) {
      console.error("Failed to load game state from local storage:", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Auto-save game state to local storage
  useEffect(() => {
    if (gameStarted && !gameState.isGameOver) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
      } catch (error) {
        console.error("Failed to save game state to local storage:", error);
      }
    } else if (gameState.isGameOver) {
      // Clear saved game on game over
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [gameState, gameStarted]);

  // Initialize game state and show briefing when a new game is selected
  const startNewGame = (caseId: string) => {
    const selectedCase = CASES.find(c => c.id === caseId);
    if (selectedCase) {
      // Initialize grid and operations, but don't start timer or game yet
      const { grid, operations } = initializeGridWithOperations(GRID_SIZE, selectedCase.operations);
      setGameState({
        ...initialGameState,
        grid,
        operations,
        currentCaseId: caseId,
        clues: [], // Explicitly reset clues for a new game
      });
      setCurrentCase(selectedCase);
      setShowBriefingModal(true); // Show briefing modal
      setFinalScore(null); // Reset score for new game
    }
  };

  // Function to actually begin the investigation after briefing
  const handleBeginInvestigation = () => {
    setGameStarted(true); // This will start the timer effects
    setShowBriefingModal(false); // Hide the briefing modal
  };

  // Resume game logic
  const continueGame = () => {
    try {
      const savedGameState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedGameState) {
        const parsedState: GameState = JSON.parse(savedGameState);
        setGameState(parsedState);
        const selectedCase = CASES.find(c => c.id === parsedState.currentCaseId);
        setCurrentCase(selectedCase || null);
        setGameStarted(true);
        setFinalScore(null); // Clear score on resume
      } else {
        console.warn("No saved game found to continue.");
      }
    } catch (error) {
      console.error("Failed to load game state from local storage:", error);
    }
  };

  // Handle retry case
  const handleRetryCase = () => {
    if (currentCase) {
      startNewGame(currentCase.id); // This will now show the briefing again
    } else {
      setGameStarted(false); // Go back to main menu if no current case
    }
  };

  // Handle select new case (also used for quit game)
  const handleSelectNewCase = () => {
    setGameStarted(false); // Go back to main menu
    setGameState(initialGameState); // Reset game state
    setCurrentCase(null);
    setFinalScore(null);
    setShowBriefingModal(false); // Ensure modal is hidden
  };

  // Handle view leaderboard logic
  const viewLeaderboard = () => {
    setGameStarted(false); // Go back to main menu context
    setShowLeaderboard(true);
  };

  // Handle back from leaderboard
  const handleBackToMainMenuFromLeaderboard = () => {
    setShowLeaderboard(false);
  };

  // Timer effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (gameStarted && !gameState.isGameOver) { // Timer starts only when gameStarted is true
      timerInterval = setInterval(() => {
        setGameState(prevState => ({
          ...prevState,
          timer: prevState.timer + 1,
        }));
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [gameStarted, gameState.isGameOver]); // Depend on gameStarted

  // Periodic clue effect
  useEffect(() => {
    let periodicClueInterval: NodeJS.Timeout;
    if (gameStarted && !gameState.isGameOver) { // Clues start only when gameStarted is true
      periodicClueInterval = setInterval(() => {
        setGameState(prevState => {
          const newClue = generatePeriodicClue(prevState.operations, GRID_SIZE);
          if (newClue) {
            return {
              ...prevState,
              clues: [...prevState.clues, newClue],
            };
          }
          return prevState;
        });
      }, 10000); // Generate a periodic clue every 10 seconds
    }

    return () => clearInterval(periodicClueInterval);
  }, [gameStarted, gameState.isGameOver, gameState.operations]); // Depend on gameStarted

  const handleCellClick = (row: number, col: number) => {
    setGameState(prevGameState => {
      if (prevGameState.isGameOver) {
        return prevGameState;
      }

      const newGrid = prevGameState.grid.map(rowArr => [...rowArr]);
      const newOperations = prevGameState.operations.map(op => ({ ...op }));
      let newClues = [...prevGameState.clues];
      const cell = newGrid[row][col];

      if (cell.status !== 'uninvestigated') {
        return prevGameState;
      }

      const newSweepsUsed = prevGameState.sweepsUsed + 1;
      let newIsGameOver = false;
      let newIsVictory = false;

      if (cell.operationId) {
        // It's a hit!
        const operation = newOperations.find(op => op.id === cell.operationId);
        if (operation) {
          // Mark the cell as partial_hit for now
          newGrid[row][col] = { ...cell, status: 'partial_hit' };

          // Check if all parts of the operation are now discovered
          const discoveredCellsForOperation = operation.coordinates.filter(([r, c]) =>
            newGrid[r][c].status === 'partial_hit' || newGrid[r][c].status === 'busted'
          ).length; // Removed +1

          if (discoveredCellsForOperation === operation.coordinates.length) {
            // Operation is fully busted!
            operation.busted = true;
            operation.coordinates.forEach(([r, c]) => {
              newGrid[r][c].status = 'busted';
            });
          }
        }
      } else {
        // It's a miss
        newGrid[row][col] = { ...cell, status: 'empty' };
        const environmentalClue = generateEnvironmentalClue(row, col, newGrid, newOperations, GRID_SIZE);
        if (environmentalClue) {
          newClues = [...prevGameState.clues, environmentalClue];
        }
      }

      // Check for victory condition
      if (newOperations.every(op => op.busted)) {
        newIsVictory = true;
        newIsGameOver = true;
      }

      // Check for failure condition
      if (newSweepsUsed >= 30 && !newIsVictory) {
        newIsGameOver = true;
      }

      const calculatedScore = (newIsVictory || newIsGameOver) ? (prevGameState.timer + (newSweepsUsed * 10)) : null;

      return {
        ...prevGameState,
        grid: newGrid,
        operations: newOperations,
        sweepsUsed: newSweepsUsed,
        isGameOver: newIsGameOver,
        isVictory: newIsVictory,
        score: calculatedScore !== null ? calculatedScore : prevGameState.score,
        clues: newClues,
      };
    });

    // Save score to leaderboard if game is over and it's a victory
    if (gameState.isGameOver && gameState.isVictory && gameState.score !== null && gameState.currentCaseId) {
      try {
        const existingLeaderboard = JSON.parse(localStorage.getItem('detectiveGridGameLeaderboard') || '[]');
        const newLeaderboard = [...existingLeaderboard, {
          caseId: gameState.currentCaseId,
          score: gameState.score,
          timestamp: Date.now(),
        }];
        localStorage.setItem('detectiveGridGameLeaderboard', JSON.stringify(newLeaderboard));
      } catch (error) {
        console.error("Failed to save score to leaderboard:", error);
      }
    }
  };

  return (
    <>
      {showLeaderboard ? (
        <Leaderboard onBackToMainMenu={handleBackToMainMenuFromLeaderboard} />
      ) : showBriefingModal && currentCase ? ( // Show briefing modal
        <CaseBriefingModal caseConfig={currentCase} onBeginInvestigation={handleBeginInvestigation} />
      ) : !gameStarted ? (
        <MainMenu
          onStartNewGame={startNewGame}
          onContinueGame={continueGame}
          onViewLeaderboard={viewLeaderboard}
          hasSavedGame={typeof window !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_KEY) !== null}
        />
      ) : gameState.isGameOver ? (
        <EndGameScreen
          isVictory={gameState.isVictory}
          score={gameState.score || 0}
          onRetryCase={handleRetryCase}
          onSelectNewCase={handleSelectNewCase}
          onViewLeaderboard={viewLeaderboard}
        />
      ) : (
        <GameLayout
          sweepsUsed={gameState.sweepsUsed}
          timer={gameState.timer}
          clues={gameState.clues}
          onQuitGame={handleSelectNewCase}
          caseTitle={currentCase ? currentCase.title : 'Operation: Shadow Network'}
          operations={gameState.operations} // Pass operations to GameLayout
        >
          <Grid grid={gameState.grid} operations={gameState.operations} onCellClick={handleCellClick} />
        </GameLayout>
      )}
    </>
  );
}
