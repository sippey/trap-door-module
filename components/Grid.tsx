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
      width: 'min(90vw, 90vh)', // Responsive size
      height: 'min(90vw, 90vh)', // Responsive size
      maxWidth: '600px', // Max size for desktop
      maxHeight: '600px', // Max size for desktop
      border: '1px solid #555',
    }}>
      {grid.map((row, rowIndex) => (
        row.map((cell: GridCell, colIndex: number) => {
          const isBusted = cell.status === 'busted';
          const operationType = isBusted ? operations.find(op => op.id === cell.operationId)?.type : null;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '100%',
                height: '100%',
                border: isBusted ? '2px solid green' : (cell.status === 'partial_hit' ? '2px solid red' : '1px solid #444'),
                display: 'flex',
                flexDirection: 'column', // Allow text and coordinates
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: cell.status === 'uninvestigated' ? '#333' : (cell.status === 'empty' ? '#666' : (cell.status === 'partial_hit' ? '#884400' : '#005500')), // Darker colors for hits
                backgroundImage: cell.status === 'uninvestigated' ? `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='100' height='100' fill='%23333'/%3E%3Cpath d='M0 0L100 0L100 100L0 100Z' fill='%23333'/%3E%3Cpath d='M10 10L40 10L40 40L10 40Z' fill='%23444'/%3E%3Cpath d='M60 20L90 20L90 50L60 50Z' fill='%23444'/%3E%3Cpath d='M20 60L50 60L50 90L20 90Z' fill='%23444'/%3E%3C/svg%3E")` : (cell.status === 'partial_hit' ? `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-10 10L110 110M-10 30L110 130M-10 50L110 150M-10 70L110 170M-10 90L110 190' stroke='%23AA6600' stroke-width='2'/%3E%3C/svg%3E")` : (isBusted ? `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 50L45 75L80 30' fill='none' stroke='%2300FF00' stroke-width='8'/%3E%3C/svg%3E")` : 'none')),
                backgroundSize: 'cover',
                fontSize: '0.7em', // Smaller font for responsiveness
              }}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {operationType && <span style={{ fontSize: '0.8em', textAlign: 'center', color: 'white', textShadow: '1px 1px 2px black' }}>{operationType}</span>}
              {`${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default Grid;