import { TrapDoor, GridState, Clue } from './gameState';

// Helper to check if a set of coordinates is within grid bounds
const isValidCoordinate = (row: number, col: number, gridSize: number): boolean => {
  return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
};

// Generates a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generates a square escape hatch of given size (e.g., 2x2)
export const generateEscapeHatch = (
  gridSize: number,
  escapeHatchSize: number
): TrapDoor => {
  // Calculate the dimension of the escape hatch (e.g., 2 for a 2x2 hatch)
  const dimension = Math.sqrt(escapeHatchSize);
  if (!Number.isInteger(dimension)) {
    throw new Error('Escape hatch size must be a perfect square');
  }

  // Ensure escape hatch fits within the grid
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

// Function to initialize the game grid with escape hatch
export const initializeGridWithEscapeHatch = (
  gridSize: number,
  escapeHatchSize: number
): { grid: GridState; escapeHatch: TrapDoor } => {
  const escapeHatch = generateEscapeHatch(gridSize, escapeHatchSize);
  const grid: GridState = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill(null).map(() => ({ 
      status: 'unchecked', 
      isEscapeHatch: false, 
      clue: null 
    }))
  );

  // Mark escape hatch cells
  for (const [r, c] of escapeHatch.coordinates) {
    grid[r][c].isEscapeHatch = true;
  }

  return { grid, escapeHatch };
};

// Generates a clue when the player hits part of the escape hatch
export const generateEscapeHatchHitClue = (): Clue => {
  const clues = [
    `Panel responds with a soft illumination and mechanical click.`,
    `Pressure sensor activated - LED strip illuminates the edges.`,
    `This panel feels different - slightly warmer than others.`,
    `Haptic feedback confirms connection to hydraulic system underneath.`,
    `Status indicator activates - part of access sequence detected.`,
    `Your touch triggers a faint vibration in this panel.`,
    `Embedded sensors detect authorized pressure pattern here.`,
    `This panel yields slightly with a quiet servo whir.`,
    `Neural interface briefly flickers to life under your fingers.`,
    `Biometric scanner confirms this panel is access-enabled.`,
  ];

  return {
    id: generateId(),
    type: 'partial_hit_confirmation',
    message: clues[Math.floor(Math.random() * clues.length)],
    timestamp: Math.floor(Date.now() / 1000),
  };
};

// Generates a clue when the player finds the complete escape hatch
export const generateEscapeHatchFoundClue = (): Clue => {
  const clues = [
    `Access sequence complete - hatch unseals with hydraulic hiss.`,
    `Emergency maintenance tunnel illuminates with safety lighting below.`,
    `Biometric authorization confirmed - escape route now accessible.`,
    `Hydraulic systems engage as the escape hatch opens smoothly.`,
  ];

  return {
    id: generateId(),
    type: 'partial_hit_confirmation',
    message: clues[Math.floor(Math.random() * clues.length)],
    timestamp: Math.floor(Date.now() / 1000),
  };
};

// Generates a clue when the player taps an inactive panel
export const generateMissClue = (tapCount: number): Clue => {
  const clues = [
    `Panel shows error indicator - not part of access sequence.`,
    `Inactive sensor responds with frustrated electronic chirp.`,
    `Dead panel - its neural pathways severed long ago.`,
    `Status indicator remains inactive under your desperate touch.`,
    `This panel's biometric scanner rejects your authorization.`,
    `System diagnostic shows this pathway is permanently offline.`,
    `Emergency protocols have disabled this section's functionality.`,
    `The smart surface remains cold and unresponsive.`,
    `Panel memory banks corrupted - access sequence unknown.`,
    `Building AI marks this panel as non-essential.`,
    `Pressure sensors register but refuse to engage hydraulics.`,
    `LED grid flickers briefly then returns to dormant state.`,
    `Security lockdown has quarantined this panel from access.`,
    `Database shows this route decommissioned in 2026.`,
    `Your biometrics fail to match authorized user profiles.`,
    `Emergency power levels decrease slightly with each failed attempt.`,
    `Building systems grow more suspicious of your presence.`,
    `Time remaining before automated security sweep activates.`,
    `Each failed scan increases your digital footprint.`,
    `The investigation window narrows with every mistake.`,
  ];

  return {
    id: generateId(),
    type: 'environmental',
    message: clues[Math.floor(Math.random() * clues.length)],
    timestamp: Math.floor(Date.now() / 1000),
  };
};

// Removed old environmental and periodic clue functions - now using cyberpunk tech-themed versions