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

// Generates a Holmes-themed clue when the player hits part of the trap door
export const generateTrapDoorHitClue = (): Clue => {
  const clues = [
    `The floorboard gives slightly under your touch - Holmes' craftsmanship at work.`,
    `A hollow echo resonates beneath this panel. Your pulse quickens with hope.`,
    `This board feels different... older, more worn. Part of Holmes' deadly design.`,
    `The wood here is smooth from countless hands that came before you.`,
    `Something shifts beneath this panel. The trap door mechanism stirs to life.`,
  ];

  return {
    id: generateId(),
    type: 'partial_hit_confirmation',
    message: clues[Math.floor(Math.random() * clues.length)],
    timestamp: Math.floor(Date.now() / 1000),
  };
};

// Generates a Holmes-themed clue when the player finds the complete trap door
export const generateTrapDoorFoundClue = (): Clue => {
  const clues = [
    `The trap door springs open with a mechanical groan - Holmes' escape route revealed!`,
    `The panels slide away to reveal the darkness below. Freedom lies in the depths.`,
    `Holmes' masterpiece unfolds before you - a perfect trap door, your path to salvation.`,
    `The mechanism clicks into place as the hidden passage opens. You've outwitted the devil himself.`,
  ];

  return {
    id: generateId(),
    type: 'partial_hit_confirmation',
    message: clues[Math.floor(Math.random() * clues.length)],
    timestamp: Math.floor(Date.now() / 1000),
  };
};

// Generates a Holmes-themed clue when the player taps an empty space
export const generateMissClue = (tapCount: number): Clue => {
  const earlyGameClues = [
    `The solid wood mocks your desperation. Holmes built his floors to deceive.`,
    `Nothing but cold, unforgiving boards. The castle keeps its secrets well.`,
    `Another dead end. You can almost hear Holmes' laughter echoing through the walls.`,
    `The floorboard holds firm, taunting you with false hope.`,
    `Your knuckles ache against the solid wood. Holmes designed every plank to torment.`,
  ];

  const midGameClues = [
    `Time slips away like the victims who came before you. Still nothing.`,
    `The walls seem to close in as another panel proves worthless.`,
    `Your strength wanes, just as Holmes intended. The clock is ticking.`,
    `The solid thud echoes your growing despair. Holmes' trap tightens.`,
    `Each failed attempt brings you closer to Holmes' return.`,
  ];

  const lateGameClues = [
    `Panic sets in. Holmes could return at any moment and find you here.`,
    `Your hands shake with exhaustion and terror. Is there even a way out?`,
    `The Murder Castle has claimed so many. Will you join them in the basement?`,
    `Holmes' footsteps echo somewhere in the distance. Time is almost up.`,
    `Desperation claws at your throat as another panel fails to yield freedom.`,
  ];

  let clueArray = earlyGameClues;
  if (tapCount > 20) {
    clueArray = lateGameClues;
  } else if (tapCount > 10) {
    clueArray = midGameClues;
  }

  return {
    id: generateId(),
    type: 'environmental',
    message: clueArray[Math.floor(Math.random() * clueArray.length)],
    timestamp: Math.floor(Date.now() / 1000),
  };
};

// Removed old environmental and periodic clue functions - now using Holmes-themed versions