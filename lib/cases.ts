import { OperationType } from './gameState';

export interface CaseConfig {
  id: string;
  title: string;
  description: string;
  narrative: string; // Two-paragraph summary
  instructions: string; // Quick set of instructions
  operations: { type: OperationType; size: number }[];
}

export const CASES: CaseConfig[] = [
  {
    id: 'dockyard-conspiracy',
    title: 'The Dockyard Conspiracy',
    description: 'Focus: Drug smuggling and weapons trafficking. Operations: Warehouse labs, shipping containers, safe houses.',
    narrative: `Metro City's docks have become a hotbed of illicit activity. Intelligence reports indicate a major criminal syndicate is using the bustling port to smuggle narcotics and illegal weaponry. Your mission, Detective Chen, is to dismantle their operations before they can flood the city with contraband.

    We've identified several key locations: hidden warehouse labs, shipping containers repurposed for illicit goods, and safe houses for their operatives. Time is critical, and resources are limited. Every sweep counts.`,
    instructions: `Scan the 10x10 grid to locate all hidden criminal operations. Click on squares to investigate. A red border means you've hit part of an operation; a green border means it's fully busted. Uncover all parts of an operation to bust it. You have 30 sweeps. The timer starts when you begin your investigation.`,
    operations: [
      { type: 'Warehouse Lab', size: 5 },
      { type: 'Shipping Container', size: 4 },
      { type: 'Shipping Container', size: 3 },
      { type: 'Safe House', size: 2 },
    ],
  },
  {
    id: 'silicon-valley-shadows',
    title: 'Silicon Valley Shadows',
    description: 'Focus: Cyber crime and corporate espionage. Operations: Server farms, data centers, front companies.',
    narrative: `The gleaming towers of Silicon Valley hide a dark underbelly of cybercrime and corporate espionage. A shadowy collective is exploiting vulnerabilities in tech giants, stealing intellectual property, and manipulating markets. Detective Chen, your expertise in digital forensics is crucial here.

    Their operations are spread across server farms, clandestine data centers, and seemingly legitimate front companies. These networks are elusive, and their digital footprints are minimal. You must act swiftly and precisely to uncover their hidden infrastructure.`,
    instructions: `Navigate the digital grid to pinpoint the cybercrime network's hidden infrastructure. Click on squares to initiate a scan. Partial hits will show a red border, while fully exposed operations will turn green. Uncover all segments of each operation. You have 30 sweeps. The clock is ticking from the moment you begin.`,
    operations: [
      { type: 'Server Farm', size: 4 },
      { type: 'Data Center', size: 3 },
      { type: 'Front Company', size: 2 },
      { type: 'Server Farm', size: 3 },
    ],
  },
  {
    id: 'art-district-heist',
    title: 'Art District Heist',
    description: 'Focus: Art forgery and money laundering. Operations: Forgery studios, auction houses, storage facilities.',
    narrative: `Metro City's vibrant Art District is being tainted by a sophisticated art forgery and money laundering ring. Priceless masterpieces are being replicated and sold on the black market, with the proceeds funneled through a complex financial web. Detective Chen, your keen eye for detail is needed to expose this elaborate scheme.

    Their key locations include hidden forgery studios, corrupt auction houses, and discreet storage facilities. The art world is notoriously secretive, making this a delicate operation. Every move must be calculated to avoid alerting the culprits.`,
    instructions: `Investigate the artistic grid to expose the forgery and money laundering operations. Click on squares to sweep for activity. Red borders indicate a partial discovery; green borders signify a fully busted operation. Locate all parts of each criminal enterprise. You have 30 sweeps. Your investigation begins now.`,
    operations: [
      { type: 'Forgery Studio', size: 5 },
      { type: 'Auction House', size: 3 },
      { type: 'Storage Facility', size: 2 },
      { type: 'Forgery Studio', size: 4 },
    ],
  },
];