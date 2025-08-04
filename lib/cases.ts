export interface RoomConfig {
  id: string;
  title: string;
  description: string;
  narrative: string;
  instructions: string;
  trapDoorSize: number; // Size of the trap door (e.g., 2x2)
}

export const ROOM: RoomConfig = {
  id: 'murder-castle-room',
  title: 'The Windowless Room',
  description: 'Escape from H.H. Holmes\' chamber of horrors.',
  narrative: `You've awakened in a dimly lit, windowless room. The acrid smell of lime and something far worse fills your nostrils. The door behind you is sealed tight, but you know there must be a way out. 
  
  You drop to your hands and knees on the cold wooden floor, and you realize there is a precise 10x10 grid of panels. One of them must be a way out. Every panel you test brings you closer to escape...or insanity.`,
  instructions: `Tap the panels to search for the hidden trap door. An orange tile means you've found part of the mechanism; a brown one is a dead end.`,
  trapDoorSize: 4, // 2x2 trap door
};