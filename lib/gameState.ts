export type GridCellStatus = 'unchecked' | 'knocking' | 'empty' | 'partial_hit' | 'found';

export interface GridCell {
  status: GridCellStatus;
  isTrapDoor: boolean;
  clue: string | null;
}

export type GridState = GridCell[][];

export interface TrapDoor {
  id: string;
  coordinates: [number, number][]; // Array of [row, col]
  found: boolean;
}

export interface Clue {
  id: string;
  type: 'environmental' | 'partial_hit_confirmation' | 'periodic_update';
  message: string;
  timestamp: number; // Unix timestamp
}

export interface GameState {
  grid: GridState;
  trapDoor: TrapDoor | null;
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
      isTrapDoor: false, 
      clue: null 
    }))
  ),
  trapDoor: null,
  tapsUsed: 0,
  timer: 0,
  clues: [],
  isGameOver: false,
  isVictory: false,
  score: null,
};