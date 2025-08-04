import React from 'react';
import { ROOM } from '../lib/cases';
import styles from '../styles/menu.module.css';

interface IntroScreenProps {
  onBeginGame: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onBeginGame }) => {
  return (
    <div className={styles.menuContainer}>
      <h1>{ROOM.title}</h1>
      <div style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'left', lineHeight: '1.6' }}>
        <p>{ROOM.narrative.split('\n\n')[0]}</p>
        <p>{ROOM.narrative.split('\n\n')[1]}</p>
        <h2 style={{ marginTop: '30px' }}>Your Objective:</h2>
        <p>{ROOM.instructions}</p>
      </div>
      <button
        onClick={onBeginGame}
        className={`${styles.button} ${styles.buttonPrimary}`}
        style={{ marginTop: '30px' }}
      >
        Enter the Murder Castle
      </button>
    </div>
  );
};

export default IntroScreen;