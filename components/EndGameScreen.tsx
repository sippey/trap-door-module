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
      <h1 style={{ color: isVictory ? '#28a745' : '#dc3545' }}>
        {isVictory ? 'Escaped the Murder Castle!' : 'Trapped Forever'}
      </h1>
      <p style={{ fontSize: '1.2em', marginTop: '20px' }}>
        {isVictory ? `You outwitted Holmes and escaped through his trap door into the Chicago night.` : `Holmes' footsteps echo in the hallway. You've become another victim of the Murder Castle.`}
      </p>
      <div className={styles.buttonGroup}>
        <button
          onClick={onRetry}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          Try Again
        </button>
        <button
          onClick={onBackToMainMenu}
          className={`${styles.button} ${styles.buttonInfo}`}
        >
          Back to Start
        </button>
      </div>
    </div>
  );
};

export default EndGameScreen;