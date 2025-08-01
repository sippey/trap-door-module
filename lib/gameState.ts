export type GridCellStatus = 'uninvestigated' | 'empty' | 'partial_hit' | 'busted';

export interface GridCell {
  status: GridCellStatus;
  operationId: string | null;
  clue: string | null;
}

export type GridState = GridCell[][];

export type OperationType = 'Drug Lab' | 'Weapons Cache' | 'Money Laundering Front' | 'Server Farm' | 'Data Center' | 'Front Company' | 'Forgery Studio' | 'Auction House' | 'Storage Facility' | 'Shipping Container' | 'Warehouse Lab' | 'Safe House';

export interface Operation {
  id: string;
  type: OperationType;
  coordinates: [number, number][]; // Array of [row, col]
  busted: boolean;
}

export interface Clue {
  id: string;
  type: 'environmental' | 'partial_hit_confirmation' | 'periodic_update';
  message: string;
  timestamp: number; // Unix timestamp
}

export interface GameState {
  grid: GridState;
  operations: Operation[];
  sweepsUsed: number;
  timer: number; // Time in seconds
  clues: Clue[];
  currentCaseId: string | null;
  isGameOver: boolean;
  isVictory: boolean;
  score: number | null; // Add score to GameState
}

export const initialGameState: GameState = {
  grid: Array(10).fill(null).map(() => Array(10).fill(null).map(() => ({ status: 'uninvestigated', operationId: null, clue: null }))),
  operations: [],
  sweepsUsed: 0,
  timer: 0,
  clues: [],
  currentCaseId: null,
  isGameOver: false,
  isVictory: false,
  score: null, // Initialize score to null
};