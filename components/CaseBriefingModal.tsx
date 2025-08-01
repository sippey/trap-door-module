import React from 'react';
import { CaseConfig } from '../lib/cases';
import styles from '../styles/menu.module.css';

interface CaseBriefingModalProps {
  caseConfig: CaseConfig;
  onBeginInvestigation: () => void;
}

const CaseBriefingModal: React.FC<CaseBriefingModalProps> = ({ caseConfig, onBeginInvestigation }) => {
  return (
    <div className={styles.menuContainer}>
      <h1>Case Briefing: {caseConfig.title}</h1>
      <div style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'left', lineHeight: '1.6' }}>
        <p>{caseConfig.narrative.split('\n\n')[0]}</p>
        <p>{caseConfig.narrative.split('\n\n')[1]}</p>
        <h2 style={{ marginTop: '30px' }}>Your Mission:</h2>
        <p>{caseConfig.instructions}</p>
      </div>
      <button
        onClick={onBeginInvestigation}
        className={`${styles.button} ${styles.buttonPrimary}`}
        style={{ marginTop: '30px' }}
      >
        Begin Investigation
      </button>
    </div>
  );
};

export default CaseBriefingModal;