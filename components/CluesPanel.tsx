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
        <p style={{ 
          fontSize: '1.1em', 
          lineHeight: '1.4', 
          margin: '0',
          padding: '20px',
          textAlign: 'center',
          fontStyle: 'italic',
          color: '#ccc'
        }}>
          {latestClue.message}
        </p>
      ) : (
        <p style={{ 
          fontSize: '1.1em', 
          fontStyle: 'italic', 
          color: '#666',
          margin: '0',
          padding: '20px',
          textAlign: 'center'
        }}>
          The silence is deafening...
        </p>
      )}
    </div>
  );
};

export default CluesPanel;