import React from 'react';
import { GridState, GridCell, TrapDoor } from '../lib/gameState';
import styles from '../styles/grid.module.css';

interface GridProps {
  grid: GridState;
  escapeHatch: TrapDoor | null;
  onCellClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, escapeHatch, onCellClick }) => {
  return (
    <div className={styles.gridContainer}>
      {grid.map((row, rowIndex) => (
        row.map((cell: GridCell, colIndex: number) => {
          const isFound = cell.status === 'found';
          const isKnocking = cell.status === 'knocking';

          let backgroundColor = 'transparent'; // Use CSS default for unchecked
          if (cell.status === 'empty') {
            backgroundColor = '#FF79C6'; // Dracula pink for unsuccessful attempts
          } else if (cell.status === 'partial_hit') {
            backgroundColor = '#8BE9FD'; // Dracula cyan for successful attempts (partial hits)
          } else if (isFound) {
            backgroundColor = '#50FA7B'; // Dracula green for found escape hatch - complete success
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${styles.gridCell} ${isKnocking ? styles.gridCellKnocking : ''}`}
              style={{
                backgroundColor: isKnocking ? undefined : backgroundColor, // Let CSS animation handle knocking color
              }}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {isFound && <span className={styles.trapDoorLabel}>ESCAPE HATCH</span>}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default Grid;