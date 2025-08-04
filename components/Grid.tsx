import React from 'react';
import { GridState, GridCell, TrapDoor } from '../lib/gameState';
import styles from '../styles/grid.module.css';

interface GridProps {
  grid: GridState;
  trapDoor: TrapDoor | null;
  onCellClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, trapDoor, onCellClick }) => {
  return (
    <div className={styles.gridContainer}>
      {grid.map((row, rowIndex) => (
        row.map((cell: GridCell, colIndex: number) => {
          const isFound = cell.status === 'found';
          const isKnocking = cell.status === 'knocking';

          let backgroundColor = 'rgba(228, 206, 175, 0.05)'; // dun - very subtle for unchecked
          if (cell.status === 'empty') {
            backgroundColor = '#562a0e'; // solid seal-brown for empty cells - high contrast
          } else if (cell.status === 'partial_hit') {
            backgroundColor = '#c8691c'; // solid alloy-orange for partial hits - high contrast
          } else if (isFound) {
            backgroundColor = '#78380c'; // solid russet for found trap door - high contrast
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
              {isFound && <span className={styles.trapDoorLabel}>TRAP DOOR</span>}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default Grid;