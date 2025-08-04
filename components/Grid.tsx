import React from 'react';
import { GridState, GridCell, TrapDoor } from '../lib/gameState';

interface GridProps {
  grid: GridState;
  trapDoor: TrapDoor | null;
  onCellClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, trapDoor, onCellClick }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      gridTemplateRows: 'repeat(10, 1fr)',
      width: '100%',
      height: '100%',
      border: '1px dotted orange',
    }}>
      {grid.map((row, rowIndex) => (
        row.map((cell: GridCell, colIndex: number) => {
          const isFound = cell.status === 'found';

          let backgroundColor = 'rgba(128, 128, 128, 0.05)'; // Very low transparency for unchecked
          if (cell.status === 'empty') {
            backgroundColor = 'rgba(0, 0, 0, 0.5)'; // More transparent black for empty cells
          } else if (cell.status === 'partial_hit') {
            backgroundColor = 'rgba(255, 0, 0, 0.4)';
          } else if (isFound) {
            backgroundColor = 'rgba(0, 255, 0, 0.4)';
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '100%',
                height: '100%',
                border: '1px dotted orange',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: backgroundColor,
              }}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {isFound && <span style={{ fontSize: '0.8em', textAlign: 'center', color: 'white', textShadow: '1px 1px 2px black' }}>TRAP DOOR</span>}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default Grid;