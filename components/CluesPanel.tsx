import React from 'react';
import { Clue } from '../lib/gameState';
import styles from '../styles/game.module.css'; // Import the CSS module

interface CluesPanelProps {
  clues: Clue[];
}

const CluesPanel: React.FC<CluesPanelProps> = ({ clues }) => {
  return (
    <div className={styles.cluesPanel}>
      <h3>Intel</h3>
      {clues.length === 0 ? (
        <p>No clues yet. Investigate districts to gather intelligence.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {clues.map((clue) => (
            <li key={clue.id} style={{ marginBottom: '5px', fontSize: '0.9em' }}>
              <strong>[{new Date(clue.timestamp * 1000).toLocaleTimeString()}]</strong> {clue.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CluesPanel;