import React from 'react';
import styles from '../styles/menu.module.css';

interface EndGameScreenProps {
  isVictory: boolean;
  onRetry: () => void;
  onBackToMainMenu: () => void;
}

const EndGameScreen: React.FC<EndGameScreenProps> = ({
  isVictory,
  onRetry,
  onBackToMainMenu,
}) => {
  return (
    <div className={styles.menuContainer}>
      <h1 style={{ color: isVictory ? '#50FA7B' : '#FF5555' }}>
        {isVictory ? 'Access Granted' : 'Investigation Failed'}
      </h1>
      <p style={{ fontSize: '1.2em', marginTop: '20px' }}>
        {isVictory ? `Emergency maintenance tunnel accessed. You've found the escape route the missing technologists discovered. Time to report back and uncover the truth.` : `Building security systems detected unauthorized access. Your investigation has been terminated. The missing technologists' fate remains a mystery.`}
      </p>
      <div className={styles.buttonGroup}>
        <button
          onClick={onRetry}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          New Investigation
        </button>
        <button
          onClick={onBackToMainMenu}
          className={`${styles.button} ${styles.buttonInfo}`}
        >
          Return to Briefing
        </button>
      </div>
    </div>
  );
};

export default EndGameScreen;