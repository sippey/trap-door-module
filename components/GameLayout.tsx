import React from 'react';
import { Clue, TrapDoor } from '../lib/gameState';
import CluesPanel from './CluesPanel';
import styles from '../styles/game.module.css';

interface GameLayoutProps {
  children: React.ReactNode;
  currentSanity: number;
  timer: number;
  clues: Clue[];
  gameTitle: string;
  escapeHatch: TrapDoor | null;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const pad = (num: number) => num < 10 ? '0' + num : num;
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};

const GameLayout: React.FC<GameLayoutProps> = ({ children, currentSanity, timer, clues, gameTitle, escapeHatch }) => {
  const sanityPercentage = Math.max(currentSanity, 0); // Sanity is already a percentage (0-100)

  // Color changes as sanity depletes - using Dracula palette
  const getSanityColor = (sanity: number) => {
    if (sanity > 66) return '#50FA7B'; // Dracula green (optimal/focused)
    if (sanity > 33) return '#F1FA8C'; // Dracula yellow (caution/pressure)
    return '#FF5555'; // Dracula red (critical/detected)
  };

  return (
    <div className={styles.fullViewportContainer}>
      {/* Navigation Bar at Top */}
      <div className={styles.navigationBar}>
        <h2>{gameTitle}</h2>
        <div className={styles.gameStats}>
          <span>Timer: {formatTime(timer)}</span>
          <div className={styles.energyContainer}>
            <span className={styles.energyLabel}>Sanity: {Math.max(currentSanity, 0)}</span>
            <div className={styles.energyBar}>
              <div 
                className={styles.energyFill}
                style={{ 
                  width: `${sanityPercentage}%`,
                  backgroundColor: getSanityColor(sanityPercentage)
                }}
              />
            </div>
          </div>
        </div>
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