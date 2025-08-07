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
        {isVictory ? 'Escape Hatch Found' : 'Access Denied'}
      </h1>
      <p style={{ fontSize: '1.2em', marginTop: '20px' }}>
        {isVictory ? `Access granted.` : `You went insane before finding the escape hatch.`}
      </p>
    </div>
  );
};

export default EndGameScreen;