import React from 'react';
import { Operation, OperationType } from '../lib/gameState'; // Import OperationType
import styles from '../styles/game.module.css'; // Import the CSS module

interface OperationChecklistProps {
  operations: Operation[];
}

const OperationChecklist: React.FC<OperationChecklistProps> = ({ operations }) => {
  // Get unique operation types and their busted status
  const uniqueOperationTypes = Array.from(new Set(operations.map(op => op.type)))
    .map(type => {
      const isBusted = operations.some(op => op.type === type && op.busted);
      return { type, isBusted };
    });

  return (
    <div className={styles.operationChecklist}>
      <h3>Operations Checklist</h3>
      <ul>
        {uniqueOperationTypes.map((opType) => (
          <li key={opType.type} className={`${styles.operationChecklistItem} ${opType.isBusted ? styles.operationChecklistItemBusted : styles.operationChecklistItemPending}`}>
            {opType.isBusted ? (
              <span style={{ color: 'white', fontSize: '1.2em' }}>&#10003;</span> // Checkmark
            ) : (
              <span style={{ color: '#aaa', fontSize: '1.2em' }}>&#9744;</span> // Empty box
            )}
            {opType.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OperationChecklist;