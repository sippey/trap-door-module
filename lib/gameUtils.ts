import { Operation, OperationType, GridState, Clue } from './gameState';

// Helper to check if a set of coordinates is within grid bounds
const isValidCoordinate = (row: number, col: number, gridSize: number): boolean => {
  return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
};

// Helper to check if a proposed operation placement overlaps with existing operations
const isPlacementValid = (
  grid: GridState,
  coordinates: [number, number][],
  gridSize: number
): boolean => {
  for (const [r, c] of coordinates) {
    if (!isValidCoordinate(r, c, gridSize) || grid[r][c].operationId !== null) {
      return false;
    }
  }
  return true;
};

// Generates a unique ID for an operation or clue
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generates random operations for a given case
export const generateOperations = (
  gridSize: number,
  operationsConfig: { type: OperationType; size: number }[]
): Operation[] => {
  const operations: Operation[] = [];
  let tempGrid: GridState = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null).map(() => ({ status: 'uninvestigated', operationId: null, clue: null })));

  for (const config of operationsConfig) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops

    while (!placed && attempts < maxAttempts) {
      attempts++;

      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);
      const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical'; // 0 = horizontal, 1 = vertical

      const potentialCoordinates: [number, number][] = [];
      if (direction === 'horizontal') {
        for (let i = 0; i < config.size; i++) {
          potentialCoordinates.push([startRow, startCol + i]);
        }
      } else {
        for (let i = 0; i < config.size; i++) {
          potentialCoordinates.push([startRow + i, startCol]);
        }
      }

      if (isPlacementValid(tempGrid, potentialCoordinates, gridSize)) {
        const newOperation: Operation = {
          id: generateId(),
          type: config.type,
          coordinates: potentialCoordinates,
          busted: false,
        };
        operations.push(newOperation);

        // Update tempGrid with the new operation's ID
        for (const [r, c] of potentialCoordinates) {
          tempGrid[r][c].operationId = newOperation.id;
        }
        placed = true;
      }
    }

    if (!placed) {
      console.warn(`Could not place operation of type ${config.type} and size ${config.size} after ${maxAttempts} attempts.`);
    }
  }

  return operations;
};

// Function to initialize the game grid with operations
export const initializeGridWithOperations = (
  gridSize: number,
  operationsConfig: { type: OperationType; size: number }[]
): { grid: GridState; operations: Operation[] } => {
  const operations = generateOperations(gridSize, operationsConfig);
  const initialGrid: GridState = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null).map(() => ({ status: 'uninvestigated', operationId: null, clue: null })));

  // Populate the grid with operation IDs
  for (const op of operations) {
    for (const [r, c] of op.coordinates) {
      initialGrid[r][c].operationId = op.id;
    }
  }

  return { grid: initialGrid, operations };
};

// Generates an environmental clue based on proximity to operations
export const generateEnvironmentalClue = (
  row: number,
  col: number,
  grid: GridState,
  operations: Operation[],
  gridSize: number
): Clue | null => {
  const nearbyOperations: Operation[] = [];
  const searchRadius = 2; // Check within 2 squares

  for (let r = row - searchRadius; r <= row + searchRadius; r++) {
    for (let c = col - searchRadius; c <= col + searchRadius; c++) {
      if (isValidCoordinate(r, c, gridSize) && (r !== row || c !== col)) {
        const cell = grid[r][c];
        if (cell.operationId) {
          const operation = operations.find(op => op.id === cell.operationId);
          if (operation && !operation.busted && !nearbyOperations.some(op => op.id === operation.id)) {
            nearbyOperations.push(operation);
          }
        }
      }
    }
  }

  if (nearbyOperations.length > 0) {
    const randomOperation = nearbyOperations[Math.floor(Math.random() * nearbyOperations.length)];
    let message = '';
    switch (randomOperation.type) {
      case 'Drug Lab':
        message = 'Informant reports chemical odors in this area.';
        break;
      case 'Weapons Cache':
        message = 'Unusual late-night traffic reported nearby.';
        break;
      case 'Money Laundering Front':
        message = 'Suspicious financial activity detected in this sector.';
        break;
      case 'Server Farm':
        message = 'High energy consumption detected in a nearby building.';
        break;
      case 'Data Center':
        message = 'Unusual data traffic patterns originating from this vicinity.';
        break;
      case 'Front Company':
        message = 'Shell corporations with unusual transactions are operating nearby.';
        break;
      case 'Forgery Studio':
        message = 'Reports of unusual art supplies deliveries in the vicinity.';
        break;
      case 'Auction House':
        message = 'High-value art pieces are being moved discreetly in this area.';
        break;
      case 'Storage Facility':
        message = 'Large, unmarked shipments have been observed in a nearby facility.';
        break;
      case 'Shipping Container':
        message = 'Unusual activity around shipping containers in the port district.';
        break;
      case 'Warehouse Lab':
        message = 'Strange fumes and unusual activity reported from a nearby warehouse.';
        break;
      case 'Safe House':
        message = 'Known associates have been spotted frequenting a nearby residence.';
        break;
      default:
        message = 'Unusual activity detected in a nearby district.';
    }
    return {
      id: generateId(),
      type: 'environmental',
      message: `[Environmental] ${message}`,
      timestamp: Math.floor(Date.now() / 1000),
    };
  }

  return null;
};

// Generates a periodic intelligence clue
export const generatePeriodicClue = (
  operations: Operation[],
  gridSize: number
): Clue | null => {
  const availableOperations = operations.filter(op => !op.busted);
  if (availableOperations.length === 0) {
    return null;
  }

  const randomOperation = availableOperations[Math.floor(Math.random() * availableOperations.length)];
  const randomCoordinate = randomOperation.coordinates[Math.floor(Math.random() * randomOperation.coordinates.length)];

  const rowChar = String.fromCharCode(65 + randomCoordinate[1]);
  const colNum = randomCoordinate[0] + 1;

  const clues = [
    `Informant tip: Activity detected near ${randomOperation.type} in sector ${rowChar}${colNum}.`,
    `Surveillance report: Unusual patterns observed in the vicinity of a ${randomOperation.type}.`,
    `Communication intercept: A ${randomOperation.type} is active in the area of ${rowChar}${colNum}.`,
    `Banking intelligence: Suspicious transactions linked to a ${randomOperation.type} in sector ${rowChar}${colNum}.`,
  ];

  const randomClueMessage = clues[Math.floor(Math.random() * clues.length)];

  return {
    id: generateId(),
    type: 'periodic_update',
    message: `[Periodic Update] ${randomClueMessage}`,
    timestamp: Math.floor(Date.now() / 1000),
  };
};