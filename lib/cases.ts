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
  title: 'The Murder Castle',
  description: 'Escape from H.H. Holmes\' chamber of horrors.',
  narrative: `Chicago, 1893. You've awakened in a windowless room within H.H. Holmes' infamous "Murder Castle" - his hotel of horrors built for the World's Fair. The acrid smell of lime and something far worse fills your nostrils. The door behind you is sealed tight, but you remember the rumors of Holmes' elaborate trap doors and secret passages.
  
  You drop to your hands and knees on the cold wooden floor, arranged in a precise 10x10 grid of panels. Somewhere beneath these boards lies your salvation - a trap door that leads to freedom. But Holmes designed his castle well. Every sound you make, every board you test, brings you closer to discovery... or escape. The floorboards creak ominously as you begin your desperate search.`,
  instructions: `Tap floor panels to search for Holmes' hidden trap door. A red border means you've found part of the mechanism; a green border means you've opened your escape route. Find all parts to flee the Murder Castle. You have 30 taps before your strength fails and Holmes returns. Time is running out.`,
  trapDoorSize: 4, // 2x2 trap door
};