import { TrapDoor, GridState, Clue } from './gameState';

// Helper to check if a set of coordinates is within grid bounds
const isValidCoordinate = (row: number, col: number, gridSize: number): boolean => {
  return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
};

// Generates a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generates a square trap door of given size (e.g., 2x2)
export const generateTrapDoor = (
  gridSize: number,
  trapDoorSize: number
): TrapDoor => {
  // Calculate the dimension of the trap door (e.g., 2 for a 2x2 door)
  const dimension = Math.sqrt(trapDoorSize);
  if (!Number.isInteger(dimension)) {
    throw new Error('Trap door size must be a perfect square');
  }

  // Ensure trap door fits within the grid
  const maxPosition = gridSize - dimension;
  const startRow = Math.floor(Math.random() * (maxPosition + 1));
  const startCol = Math.floor(Math.random() * (maxPosition + 1));

  const coordinates: [number, number][] = [];
  for (let r = 0; r < dimension; r++) {
    for (let c = 0; c < dimension; c++) {
      coordinates.push([startRow + r, startCol + c]);
    }
  }

  return {
    id: generateId(),
    coordinates,
    found: false,
  };
};

// Function to initialize the game grid with trap door
export const initializeGridWithTrapDoor = (
  gridSize: number,
  trapDoorSize: number
): { grid: GridState; trapDoor: TrapDoor } => {
  const trapDoor = generateTrapDoor(gridSize, trapDoorSize);
  const grid: GridState = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill(null).map(() => ({ 
      status: 'unchecked', 
      isTrapDoor: false, 
      clue: null 
    }))
  );

  // Mark trap door cells
  for (const [r, c] of trapDoor.coordinates) {
    grid[r][c].isTrapDoor = true;
  }

  return { grid, trapDoor };
};

// Generates a clue when the player hits part of the trap door
export const generateTrapDoorHitClue = (): Clue => {
  const clues = [
    `The floorboard gives slightly under your desperate touch.`,
    `A hollow echo resonates beneath this weathered panel.`,
    `This board feels different, older and more worn.`,
    `The wood here is smooth from countless desperate hands.`,
    `Something shifts beneath this panel with mechanical precision.`,
    `Your fingers detect the faintest gap around this board.`,
    `The floorboard creaks with hidden promise underneath you.`,
    `This panel wobbles slightly when you press it down.`,
    `A different texture catches your fingernails on this board.`,
    `The wood grain here runs opposite to all others.`,
  ];

  return {
    id: generateId(),
    type: 'partial_hit_confirmation',
    message: clues[Math.floor(Math.random() * clues.length)],
    timestamp: Math.floor(Date.now() / 1000),
  };
};

// Generates a clue when the player finds the complete trap door
export const generateTrapDoorFoundClue = (): Clue => {
  const clues = [
    `The trap door springs open with a triumphant mechanical groan.`,
    `The panels slide away to reveal blessed darkness below.`,
    `The hidden passage unfolds before you like salvation itself.`,
    `The mechanism clicks into place as freedom finally opens.`,
  ];

  return {
    id: generateId(),
    type: 'partial_hit_confirmation',
    message: clues[Math.floor(Math.random() * clues.length)],
    timestamp: Math.floor(Date.now() / 1000),
  };
};

// Generates a clue when the player taps an empty space
export const generateMissClue = (tapCount: number): Clue => {
  const clues = [
    `The solid wood mocks your desperate, trembling fingers.`,
    `Nothing but cold, unforgiving boards beneath your palms.`,
    `Another dead end in this labyrinth of deception.`,
    `The floorboard holds firm, taunting you with false hope.`,
    `Your knuckles ache against the unyielding wooden surface.`,
    `The solid thud echoes your growing sense of despair.`,
    `Time slips away as another panel proves utterly worthless.`,
    `The walls seem to close in with each failure.`,
    `Your strength wanes with every unsuccessful desperate attempt.`,
    `Each failed tap brings you closer to doom.`,
    `Panic sets in as precious seconds tick away.`,
    `Your hands shake with exhaustion and mounting terror.`,
    `The castle has claimed so many before you.`,
    `Footsteps echo somewhere in the distance above you.`,
    `Desperation claws at your throat with each failure.`,
    `The wood grain blurs as tears cloud your vision.`,
    `Your fingertips are raw from clawing at boards.`,
    `The silence mocks your frantic search for escape.`,
    `Every second counts and this one was wasted.`,
    `The chamber seems to shrink with each failure.`,
  ];

  return {
    id: generateId(),
    type: 'environmental',
    message: clues[Math.floor(Math.random() * clues.length)],
    timestamp: Math.floor(Date.now() / 1000),
  };
};

// Removed old environmental and periodic clue functions - now using Holmes-themed versions