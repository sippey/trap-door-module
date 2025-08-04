import React from 'react';
import { Clue, TrapDoor } from '../lib/gameState';
import CluesPanel from './CluesPanel';
import styles from '../styles/game.module.css';

interface GameLayoutProps {
  children: React.ReactNode;
  tapsUsed: number;
  timer: number;
  clues: Clue[];
  gameTitle: string;
  trapDoor: TrapDoor | null;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const pad = (num: number) => num < 10 ? '0' + num : num;
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};

const GameLayout: React.FC<GameLayoutProps> = ({ children, tapsUsed, timer, clues, gameTitle, trapDoor }) => {
  const tapsRemaining = 30 - tapsUsed;
  const sanityPercentage = (tapsRemaining / 30) * 100;

  // Color changes as sanity depletes - using Murder Castle palette
  const getSanityColor = (percentage: number) => {
    if (percentage > 66) return '#e4ceaf'; // dun (calm/rational)
    if (percentage > 33) return '#d09259'; // persian-orange (worried/declining)
    return '#c8691c'; // alloy-orange (panicked/insane)
  };

  return (
    <div className={styles.fullViewportContainer}>
      {/* Navigation Bar at Top */}
      <div className={styles.navigationBar}>
        <h2>{gameTitle}</h2>
        <div className={styles.gameStats}>
          <span>Timer: {formatTime(timer)}</span>
          <div className={styles.energyContainer}>
            <span className={styles.energyLabel}>Sanity: {tapsRemaining}</span>
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