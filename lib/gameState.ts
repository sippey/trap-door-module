export type GridCellStatus = 'unchecked' | 'knocking' | 'empty' | 'partial_hit' | 'found';

export interface GridCell {
  status: GridCellStatus;
  isEscapeHatch: boolean;
  clue: string | null;
}

export type GridState = GridCell[][];

export interface EscapeHatch {
  id: string;
  coordinates: [number, number][]; // Array of [row, col]
  found: boolean;
}

// Legacy interface name for compatibility
export interface TrapDoor extends EscapeHatch {}

export interface Clue {
  id: string;
  type: 'environmental' | 'partial_hit_confirmation' | 'periodic_update';
  message: string;
  timestamp: number; // Unix timestamp
}

export interface GameState {
  grid: GridState;
  escapeHatch: EscapeHatch | null;
  tapsUsed: number;
  timer: number; // Time in seconds
  clues: Clue[];
  isGameOver: boolean;
  isVictory: boolean;
  score: number | null;
}

export const initialGameState: GameState = {
  grid: Array(10).fill(null).map(() => 
    Array(10).fill(null).map(() => ({ 
      status: 'unchecked', 
      isEscapeHatch: false, 
      clue: null 
    }))
  ),
  escapeHatch: null,
  tapsUsed: 0,
  timer: 0,
  clues: [],
  isGameOver: false,
  isVictory: false,
  score: null,
};