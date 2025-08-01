import React from 'react';
import { Clue, Operation } from '../lib/gameState'; // Import Operation
import CluesPanel from './CluesPanel';
import OperationChecklist from './OperationChecklist'; // Import OperationChecklist
import styles from '../styles/game.module.css'; // Import the CSS module

interface GameLayoutProps {
  children: React.ReactNode;
  sweepsUsed: number;
  timer: number;
  clues: Clue[];
  onQuitGame: () => void;
  caseTitle: string;
  operations: Operation[]; // New prop for operations
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const pad = (num: number) => num < 10 ? '0' + num : num;
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};

const GameLayout: React.FC<GameLayoutProps> = ({ children, sweepsUsed, timer, clues, onQuitGame, caseTitle, operations }) => {
  return (
    <div className={styles.container}>
      {/* Status Bar */}
      <div className={styles.statusBar}>
        <h2>{caseTitle}</h2>
        <div>Timer: {formatTime(timer)} | Sweeps: {sweepsUsed}/30</div>
        <button onClick={onQuitGame} className={`${styles.button} ${styles.buttonSecondary}`} style={{ marginLeft: '20px' }}>
          Quit Game
        </button>
      </div>

      {/* Main Game Area (Grid and Clues Panel) */}
      <div className={styles.mainContent}>
        <div className={styles.gameGridContainer}>
          {children} {/* This will be the Grid component */}
        </div>
        {/* Clues & Intelligence Panel */}
        <CluesPanel clues={clues} />
      </div>

      {/* Operations Checklist */}
      <OperationChecklist operations={operations} />
    </div>
  );
};

export default GameLayout;