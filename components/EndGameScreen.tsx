import React from 'react';
import styles from '../styles/menu.module.css'; // Import the CSS module

interface EndGameScreenProps {
  isVictory: boolean;
  score: number;
  onRetryCase: () => void;
  onSelectNewCase: () => void;
  onViewLeaderboard: () => void;
}

const EndGameScreen: React.FC<EndGameScreenProps> = ({
  isVictory,
  score,
  onRetryCase,
  onSelectNewCase,
  onViewLeaderboard,
}) => {
  return (
    <div className={styles.menuContainer}>
      <h1 style={{ color: isVictory ? '#28a745' : '#dc3545' }}>
        {isVictory ? 'Victory!' : 'Game Over!'}
      </h1>
      <p style={{ fontSize: '1.2em', marginTop: '20px' }}>
        {isVictory ? `Congratulations, Detective! You busted all operations.` : `Investigation failed. You ran out of sweeps.`}
      </p>
      <p style={{ fontSize: '1.5em', fontWeight: 'bold', marginTop: '10px' }}>
        Final Score: {score}
      </p>
      <div className={styles.buttonGroup}>
        <button
          onClick={onRetryCase}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          Retry Case
        </button>
        <button
          onClick={onSelectNewCase}
          className={`${styles.button} ${styles.buttonInfo}`}
        >
          Select New Case
        </button>
        <button
          onClick={onViewLeaderboard}
          className={`${styles.button} ${styles.buttonSecondary}`}
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default EndGameScreen;