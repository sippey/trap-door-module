import React from 'react';
import { GridState, GridCell, Operation } from '../lib/gameState';

interface GridProps {
  grid: GridState;
  operations: Operation[]; // Add operations to props
  onCellClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, operations, onCellClick }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      gridTemplateRows: 'repeat(10, 1fr)',
      width: '100%',
      height: '100%',
      border: '1px dotted orange', /* Dotted orange grid lines */
    }}>
      {grid.map((row, rowIndex) => (
        row.map((cell: GridCell, colIndex: number) => {
          const isBusted = cell.status === 'busted';
          const operationType = isBusted ? operations.find(op => op.id === cell.operationId)?.type : null;

          let backgroundColor = 'rgba(128, 128, 128, 0.05)'; // Very low transparency for uninvestigated
          if (cell.status === 'empty') {
            backgroundColor = 'rgba(0, 0, 0, 0.5)'; // More transparent black for empty cells
          } else if (cell.status === 'partial_hit') {
            backgroundColor = 'rgba(255, 0, 0, 0.4)';
          } else if (isBusted) {
            backgroundColor = 'rgba(0, 255, 0, 0.4)';
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '100%',
                height: '100%',
                border: '1px dotted orange', /* Consistent dotted orange grid lines */
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: backgroundColor,
              }}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {operationType && <span style={{ fontSize: '0.8em', textAlign: 'center', color: 'white', textShadow: '1px 1px 2px black' }}>{operationType}</span>}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default Grid;