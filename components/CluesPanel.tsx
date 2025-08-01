import React, { useEffect, useRef } from 'react'; // Import useEffect and useRef
import { Clue } from '../lib/gameState';
import styles from '../styles/game.module.css'; // Import the CSS module

interface CluesPanelProps {
  clues: Clue[];
}

const CluesPanel: React.FC<CluesPanelProps> = ({ clues }) => {
  const cluesEndRef = useRef<HTMLUListElement>(null); // Ref for the end of the clues list, corrected type

  // Auto-scroll to the bottom when new clues are added
  useEffect(() => {
    if (cluesEndRef.current) {
      cluesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [clues]); // Depend on the clues array

  return (
    <div className={styles.cluesPanel}>
      <h3>Intel</h3>
      {clues.length === 0 ? (
        <p>No clues yet. Investigate districts to gather intelligence.</p>
      ) : (
        <ul ref={cluesEndRef} style={{ listStyleType: 'none', padding: 0, height: '100%', overflowY: 'auto' }}> {/* Apply ref and scrolling to ul */}
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