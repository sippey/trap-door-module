'use client'

import { useState, useEffect } from "react";
import GameLayout from '../components/GameLayout';
import Grid from '../components/Grid';
import IntroScreen from '../components/IntroScreen';
import EndGameScreen from '../components/EndGameScreen';
import { initialGameState, GameState, TrapDoor } from '../lib/gameState';
import { initializeGridWithEscapeHatch, generateEscapeHatchHitClue, generateEscapeHatchFoundClue, generateMissClue } from '../lib/gameUtils';
import { ROOM } from '../lib/cases';
import { audioManager } from '../lib/audioUtils';
import { iframeComm } from '../lib/iframeComm';

const GRID_SIZE = 10;

export default function Home() {
  const LOCAL_STORAGE_KEY = 'trapDoorGameSave';

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState(true); // Always start with intro, will be updated in useEffect

  // Setup iframe communication
  useEffect(() => {
    // Skip intro if in iframe
    if (iframeComm.isInIframe()) {
      setShowIntro(false);
    }

    // Handle sanity updates from parent
    iframeComm.setOnSanityUpdate((sanity: number) => {
      setGameState(prevState => ({
        ...prevState,
        currentSanity: sanity
      }));
    });

    // Handle game completion communication
    iframeComm.setOnGameComplete((success: boolean, finalAnswer?: string) => {
      console.log('Game completed:', { success, finalAnswer });
    });

    // If in iframe and initialized, start game automatically
    if (iframeComm.isInIframe() && iframeComm.isInitialized()) {
      handleBeginGame();
    }
  }, []);

  // Auto-start game when iframe is initialized (for async initialization)
  useEffect(() => {
    if (iframeComm.isInIframe() && iframeComm.isInitialized() && !gameStarted) {
      handleBeginGame();
    }
  }, [gameStarted]);

  // Initialize and start the game
  const handleBeginGame = () => {
    // Initialize grid and escape hatch
    const { grid, escapeHatch } = initializeGridWithEscapeHatch(GRID_SIZE, ROOM.escapeHatchSize);
    setGameState({
      ...initialGameState,
      grid,
      escapeHatch,
      clues: [],
    });
    setShowIntro(false);
    setGameStarted(true);

    // Add initial intel
    setGameState(prevState => ({
      ...prevState,
      clues: [...prevState.clues, {
        id: `initial-clue-${Date.now()}`,
        type: 'periodic_update',
        message: `Building sensors detect your presence on Floor 47. Emergency lighting illuminates smart panels beneath your feet. Begin scanning for the maintenance access sequence.`,
        timestamp: Math.floor(Date.now() / 1000),
      }],
    }));
  };

  const handleRetry = () => {
    handleBeginGame();
  };

  const handleBackToIntro = () => {
    setGameStarted(false);
    setShowIntro(true);
    setGameState(initialGameState);
  };

  // Timer effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (gameStarted && !gameState.isGameOver) {
      timerInterval = setInterval(() => {
        setGameState(prevState => ({
          ...prevState,
          timer: prevState.timer + 1,
        }));
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [gameStarted, gameState.isGameOver]);

  // Removed periodic clue effect - clues now generate on every click

  const handleCellClick = (row: number, col: number) => {
    setGameState(prevGameState => {
      if (prevGameState.isGameOver || !prevGameState.escapeHatch) {
        return prevGameState;
      }

      const cell = prevGameState.grid[row][col];
      if (cell.status !== 'unchecked') {
        return prevGameState;
      }

      // First, set the cell to 'knocking' state (visual feedback)
      const newGrid = prevGameState.grid.map(rowArr => [...rowArr]);
      newGrid[row][col] = { ...cell, status: 'knocking' };

      // Play appropriate beep sound based on whether it's a hit or miss
      if (cell.isEscapeHatch) {
        audioManager.playSuccessBeep(); // beep-2.mp3 for successful attempts
      } else {
        audioManager.playFailureBeep(); // beep-1.mp3 for unsuccessful attempts
      }

      return {
        ...prevGameState,
        grid: newGrid,
      };
    });

    // After 2 seconds, reveal the actual result
    setTimeout(() => {
      setGameState(prevGameState => {
        if (prevGameState.isGameOver || !prevGameState.escapeHatch) {
          return prevGameState;
        }

        const newGrid = prevGameState.grid.map(rowArr => [...rowArr]);
        const newEscapeHatch = { ...prevGameState.escapeHatch };
        let newClues = [...prevGameState.clues];
        const cell = newGrid[row][col];

        // Skip if cell is no longer in knocking state (shouldn't happen)
        if (cell.status !== 'knocking') {
          return prevGameState;
        }

        const newSanity = prevGameState.currentSanity - 1; // Each tap costs 1 sanity
        let newIsGameOver = false;
        let newIsVictory = false;

        // Communicate sanity change to parent
        iframeComm.sendSanityChange(-1);

        if (cell.isEscapeHatch) {
          // It's a hit!
          newGrid[row][col] = { ...cell, status: 'partial_hit' };

          // Check if all parts of the escape hatch are now discovered
          const discoveredCells = newEscapeHatch.coordinates.filter(([r, c]) =>
            newGrid[r][c].status === 'partial_hit' || newGrid[r][c].status === 'found'
          ).length;

          if (discoveredCells === newEscapeHatch.coordinates.length) {
            // Escape hatch is fully found!
            newEscapeHatch.found = true;
            newEscapeHatch.coordinates.forEach(([r, c]) => {
              newGrid[r][c].status = 'found';
            });
            newIsVictory = true;
            // Generate victory clue
            newClues.push(generateEscapeHatchFoundClue());
            
            // Play hydraulic opening sound effect
            audioManager.playHydraulicOpen();
            
            // Don't set game over immediately - let player see the success state
            // We'll set game over after a delay
            setTimeout(() => {
              setGameState(prevState => ({
                ...prevState,
                isGameOver: true
              }));
            }, 3000); // 3 second pause to admire the found escape hatch
          } else {
            // Generate partial hit clue
            newClues.push(generateEscapeHatchHitClue());
          }
        } else {
          // It's a miss - generate miss clue
          newGrid[row][col] = { ...cell, status: 'empty' };
          newClues.push(generateMissClue(Math.max(100 - newSanity, 1))); // Pass attempts made
        }

        // Check for failure condition - game ends when sanity reaches 0
        if (newSanity <= 0 && !newIsVictory) {
          newIsGameOver = true;
        }

        const calculatedScore = (newIsVictory || newIsGameOver) ? (prevGameState.timer + ((100 - newSanity) * 10)) : null;

        // Send game completion message to parent
        if (newIsGameOver || newIsVictory) {
          setTimeout(() => {
            iframeComm.sendGameComplete(
              newIsVictory, 
              newIsVictory ? `Completed in ${100 - newSanity} attempts with ${newSanity} sanity remaining` : undefined
            );
          }, 100); // Small delay to ensure state is updated
        }

        return {
          ...prevGameState,
          grid: newGrid,
          escapeHatch: newEscapeHatch,
          currentSanity: newSanity,
          isGameOver: newIsGameOver,
          isVictory: newIsVictory,
          score: calculatedScore !== null ? calculatedScore : prevGameState.score,
          clues: newClues,
        };
      });
    }, 2000); // 2 second delay
  };

  return (
    <>
      {showIntro ? (
        <IntroScreen onBeginGame={handleBeginGame} />
      ) : gameState.isGameOver ? (
        <EndGameScreen
          isVictory={gameState.isVictory}
          onRetry={handleRetry}
          onBackToMainMenu={handleBackToIntro}
        />
      ) : (
        <GameLayout
          currentSanity={gameState.currentSanity}
          timer={gameState.timer}
          clues={gameState.clues}
          gameTitle={ROOM.title}
          escapeHatch={gameState.escapeHatch}
        >
          <Grid grid={gameState.grid} escapeHatch={gameState.escapeHatch} onCellClick={handleCellClick} />
        </GameLayout>
      )}
    </>
  );
}