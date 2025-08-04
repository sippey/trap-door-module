import React from 'react';
import { Clue } from '../lib/gameState';
import styles from '../styles/game.module.css';

interface CluesPanelProps {
  clues: Clue[];
}

const CluesPanel: React.FC<CluesPanelProps> = ({ clues }) => {
  // Show only the latest message
  const latestClue = clues.length > 0 ? clues[clues.length - 1] : null;

  return (
    <div className={styles.messagePanel}>
      {latestClue ? (
        <p className={styles.messagePanelText}>
          {latestClue.message}
        </p>
      ) : (
        <p className={styles.messagePanelTextEmpty}>
Awaiting investigation data...
        </p>
      )}
    </div>
  );
};

export default CluesPanel;