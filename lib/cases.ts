export interface RoomConfig {
  id: string;
  title: string;
  description: string;
  narrative: string;
  instructions: string;
  escapeHatchSize: number; // Size of the escape hatch (e.g., 2x2)
}

export const ROOM: RoomConfig = {
  id: 'transamerica-investigation',
  title: 'Find the Escape Hatch',
  description: 'Investigate missing technologists in the abandoned smart building.',
  narrative: `The emergency lighting casts an eerie blue glow across the 47th floor. Interactive smart panels cover the floor - each one equipped with pressure sensors and LED indicators.`,
  instructions: `Tap the smart floor panels to locate the emergency maintenance hatch. It's larger than one panel. Some panels will respond with status indicators - look for the complete access sequence to unlock the escape route.`,
  escapeHatchSize: 4, // 2x2 escape hatch
};