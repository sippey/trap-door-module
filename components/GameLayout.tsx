import React from 'react';
import { Clue, TrapDoor } from '../lib/gameState';
import CluesPanel from './CluesPanel';
import styles from '../styles/game.module.css';

interface GameLayoutProps {
  children: React.ReactNode;
  tapsUsed: number;
  timer: number;
  clues: Clue[];
  onQuitGame: () => void;
  gameTitle: string;
  trapDoor: TrapDoor | null;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const pad = (num: number) => num < 10 ? '0' + num : num;
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};

const GameLayout: React.FC<GameLayoutProps> = ({ children, tapsUsed, timer, clues, onQuitGame, gameTitle, trapDoor }) => {
  return (
    <div className={styles.fullViewportContainer}>
      {/* Navigation Bar at Top */}
      <div className={styles.navigationBar}>
        <h2>{gameTitle}</h2>
        <div className={styles.gameStats}>
          <span>Timer: {formatTime(timer)}</span>
          <span>Taps: {tapsUsed}/30</span>
        </div>
        <button onClick={onQuitGame} className={`${styles.button} ${styles.buttonSecondary}`}>
          Quit Game
        </button>
      </div>

      {/* Game Board in Middle */}
      <div className={styles.gameBoard}>
        {children} {/* This will be the Grid component */}
      </div>

      {/* Message Panel at Bottom */}
      <CluesPanel clues={clues} />
    </div>
  );
};

export default GameLayout;