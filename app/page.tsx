'use client'

import { useState, useEffect } from "react";
import GameLayout from '../components/GameLayout';
import Grid from '../components/Grid';
import IntroScreen from '../components/IntroScreen';
import EndGameScreen from '../components/EndGameScreen';
import { initialGameState, GameState, TrapDoor } from '../lib/gameState';
import { initializeGridWithTrapDoor, generateTrapDoorHitClue, generateTrapDoorFoundClue, generateMissClue } from '../lib/gameUtils';
import { ROOM } from '../lib/cases';
import { audioManager } from '../lib/audioUtils';

const GRID_SIZE = 10;

export default function Home() {
  const LOCAL_STORAGE_KEY = 'trapDoorGameSave';

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState(true);

  // Set CSS custom property for background image path
  useEffect(() => {
    const basePath = process.env.NODE_ENV === 'production' ? '/trap-door-module' : '';
    document.documentElement.style.setProperty('--floor-bg-image', `url('${basePath}/floor.jpg')`);
  }, []);

  // Removed saved game functionality - now always starts fresh

  // Removed auto-save functionality for simplified experience

  // Initialize and start the game
  const handleBeginGame = () => {
    // Initialize grid and trap door
    const { grid, trapDoor } = initializeGridWithTrapDoor(GRID_SIZE, ROOM.trapDoorSize);
    setGameState({
      ...initialGameState,
      grid,
      trapDoor,
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
        message: `The floorboards creak beneath your weight as you begin your desperate search through Holmes' chamber. Each panel might hide your salvation... or seal your doom.`,
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
      if (prevGameState.isGameOver || !prevGameState.trapDoor) {
        return prevGameState;
      }

      const cell = prevGameState.grid[row][col];
      if (cell.status !== 'unchecked') {
        return prevGameState;
      }

      // Play random knock sound effect
      audioManager.playRandomKnock();

      // First, set the cell to 'knocking' state
      const newGrid = prevGameState.grid.map(rowArr => [...rowArr]);
      newGrid[row][col] = { ...cell, status: 'knocking' };

      return {
        ...prevGameState,
        grid: newGrid,
      };
    });

    // After 2 seconds, reveal the actual result
    setTimeout(() => {
      setGameState(prevGameState => {
        if (prevGameState.isGameOver || !prevGameState.trapDoor) {
          return prevGameState;
        }

        const newGrid = prevGameState.grid.map(rowArr => [...rowArr]);
        const newTrapDoor = { ...prevGameState.trapDoor };
        let newClues = [...prevGameState.clues];
        const cell = newGrid[row][col];

        // Skip if cell is no longer in knocking state (shouldn't happen)
        if (cell.status !== 'knocking') {
          return prevGameState;
        }

        const newTapsUsed = prevGameState.tapsUsed + 1;
        let newIsGameOver = false;
        let newIsVictory = false;

        if (cell.isTrapDoor) {
          // It's a hit!
          newGrid[row][col] = { ...cell, status: 'partial_hit' };

          // Check if all parts of the trap door are now discovered
          const discoveredCells = newTrapDoor.coordinates.filter(([r, c]) =>
            newGrid[r][c].status === 'partial_hit' || newGrid[r][c].status === 'found'
          ).length;

          if (discoveredCells === newTrapDoor.coordinates.length) {
            // Trap door is fully found!
            newTrapDoor.found = true;
            newTrapDoor.coordinates.forEach(([r, c]) => {
              newGrid[r][c].status = 'found';
            });
            newIsVictory = true;
            // Generate victory clue
            newClues.push(generateTrapDoorFoundClue());
            
            // Play door opening sound effect
            audioManager.playDoorOpen();
            
            // Don't set game over immediately - let player see the success state
            // We'll set game over after a delay
            setTimeout(() => {
              setGameState(prevState => ({
                ...prevState,
                isGameOver: true
              }));
            }, 3000); // 3 second pause to admire the found trap door
          } else {
            // Generate partial hit clue
            newClues.push(generateTrapDoorHitClue());
          }
        } else {
          // It's a miss - generate miss clue
          newGrid[row][col] = { ...cell, status: 'empty' };
          newClues.push(generateMissClue(newTapsUsed));
        }

        // Check for failure condition
        if (newTapsUsed >= 30 && !newIsVictory) {
          newIsGameOver = true;
        }

        const calculatedScore = (newIsVictory || newIsGameOver) ? (prevGameState.timer + (newTapsUsed * 10)) : null;

        return {
          ...prevGameState,
          grid: newGrid,
          trapDoor: newTrapDoor,
          tapsUsed: newTapsUsed,
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
          tapsUsed={gameState.tapsUsed}
          timer={gameState.timer}
          clues={gameState.clues}
          gameTitle={ROOM.title}
          trapDoor={gameState.trapDoor}
        >
          <Grid grid={gameState.grid} trapDoor={gameState.trapDoor} onCellClick={handleCellClick} />
        </GameLayout>
      )}
    </>
  );
}