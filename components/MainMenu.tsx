import React from 'react';
import { CaseConfig, CASES } from '../lib/cases';
import styles from '../styles/menu.module.css'; // Import the CSS module

interface MainMenuProps {
  onStartNewGame: (caseId: string) => void;
  onContinueGame: () => void;
  onViewLeaderboard: () => void;
  hasSavedGame: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartNewGame, onContinueGame, onViewLeaderboard, hasSavedGame }) => {
  const [showCaseSelection, setShowCaseSelection] = React.useState(false);
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);

  if (showCaseSelection) {
    return (
      <div className={styles.menuContainer}>
        <h1>Select a Case</h1>
        <div className={styles.buttonGroup}>
          {CASES.map((caseItem) => (
            <button
              key={caseItem.id}
              onClick={() => onStartNewGame(caseItem.id)}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              {caseItem.title}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCaseSelection(false)}
          className={`${styles.button} ${styles.buttonSecondary}`}
          style={{ marginTop: '30px' }}
        >
          Back to Main Menu
        </button>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <div className={styles.menuContainer}>
        <h1>Leaderboard</h1>
        <p>Leaderboard content will go here.</p>
        <button
          onClick={() => setShowLeaderboard(false)}
          className={`${styles.button} ${styles.buttonSecondary}`}
          style={{ marginTop: '30px' }}
        >
          Back to Main Menu
        </button>
      </div>
    );
  }

  return (
    <div className={styles.menuContainer}>
      <h1>Operation: Shadow Network</h1>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => setShowCaseSelection(true)}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          New Game
        </button>
        <button
          onClick={onContinueGame}
          disabled={!hasSavedGame}
          className={`${styles.button} ${hasSavedGame ? styles.buttonWarning : styles.buttonDisabled}`}
        >
          Continue Game
        </button>
        <button
          onClick={onViewLeaderboard}
          className={`${styles.button} ${styles.buttonInfo}`}
        >
          Leaderboard
        </button>
      </div>
    </div>
  );
};

export default MainMenu;