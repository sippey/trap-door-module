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
  title: 'Transamerica Pyramid - Floor 47',
  description: 'Investigate missing technologists in the abandoned smart building.',
  narrative: `You're Detective Rivera, investigating the disappearance of five tech workers who vanished inside the abandoned Transamerica Pyramid. It's 2028, and this iconic San Francisco tower has been empty since the AI market crash of 2026. Your contact went silent after reporting "something wrong with the smart building systems."

  The emergency lighting casts an eerie blue glow across the 47th floor. Interactive smart panels cover the floor - each one equipped with pressure sensors and LED indicators that once guided building occupants. The building's AI systems are still partially active, but malfunctioning.`,
  instructions: `Tap the smart floor panels to locate the emergency maintenance hatch. Some panels will respond with status indicators - look for the complete access sequence to unlock the escape route.`,
  escapeHatchSize: 4, // 2x2 escape hatch
};