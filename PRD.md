# Detective Grid Game - Product Requirements Document

## Overview

**Game Title:** Operation: Shadow Network  
**Platform:** Web Browser (React/Next.js)  
**Genre:** Detective/Mystery Puzzle Game  
**Target Audience:** Casual puzzle game players  
**Core Mechanic:** Battleship-style grid investigation with detective theme

## Game Concept

### Core Game Mechanic
This game adapts the classic Battleship mechanic into a detective investigation theme. Instead of ships hidden on a naval grid, players hunt for criminal operations concealed throughout a city district grid. The fundamental gameplay loop involves:

1. **Strategic Grid Investigation**: Players click on grid squares to "sweep" or investigate that location, consuming one of their limited investigation attempts
2. **Hidden Operation Discovery**: Criminal operations are placed on the grid as multi-square shapes (similar to Battleship ships) that players must completely uncover
3. **Partial vs. Complete Discovery**: Finding one square of an operation provides clues and confirmation but requires players to find ALL squares of that operation to fully "bust" it
4. **Resource Management**: Players have exactly 30 investigation attempts to locate and completely bust all hidden operations
5. **Time Pressure**: A continuous timer adds urgency to decision-making and contributes to final scoring

### Detailed Game Concept
Players assume the role of Detective Sarah Chen, a seasoned investigator tasked with dismantling sophisticated criminal networks operating across Metro City. Intelligence reports indicate that various criminal organizations have established hidden operations throughout the city's 10x10 district grid. These operations range from drug manufacturing labs and weapons caches to money laundering fronts and safe houses.

Each case presents a unique criminal scenario with different types and quantities of hidden operations. For example, "The Dockyard Conspiracy" might feature large shipping container operations and warehouse labs, while "Silicon Valley Shadows" could involve smaller but more numerous cyber crime server farms and data centers.

The detective's job is to coordinate limited surveillance resources to systematically investigate the city grid, using intelligence gathering, environmental clues, and deductive reasoning to locate all criminal operations before they relocate or the investigation timeline expires. Success requires balancing thorough investigation with efficient resource usage, as every sweep attempt counts toward both the victory condition and final performance score.

The game combines elements of spatial reasoning (visualizing where multi-square operations might be placed), resource management (deciding when to follow up on partial hits versus exploring new areas), and time management (working efficiently under timer pressure). Like Battleship, much of the strategy involves using information from "misses" and "partial hits" to make educated guesses about where to investigate next.

## Technical Requirements

### Platform & Framework
- **Frontend:** React with Next.js framework
- **Deployment:** Web browser (desktop and mobile responsive)
- **Storage:** Local storage for save/resume and leaderboard data
- **No offline support required**

### Visual Requirements
- **Grid:** 10x10 clickable grid representing city districts
- **Styling:** CSS/SVG only - no external images
- **Theme:** Urban city map aesthetic with geometric building icons
- **Responsive design** for various screen sizes

## Core Gameplay Mechanics

### Grid Investigation System
The core interaction revolves around a 10x10 grid representing Metro City's district layout:

- **Grid Structure:** 100 clickable squares arranged in a 10x10 matrix, labeled A-J horizontally (columns) and 1-10 vertically (rows), creating coordinates like A1, B5, J10
- **Investigation Method:** Players click individual grid squares to conduct surveillance sweeps of that district
- **Resource Management:** Each case provides exactly 30 investigation attempts (sweeps) - no more, no less
- **Timer Mechanics:** A real-time timer begins counting as soon as the case briefing appears and continues throughout gameplay, creating urgency and contributing to final scoring
- **Click Feedback:** Each grid square provides immediate visual and textual feedback when investigated

### Criminal Operations Placement System
Each case features multiple criminal operations strategically hidden across the grid:

- **Operation Shapes:** Operations occupy multiple contiguous grid squares arranged in rectangular or L-shaped patterns (similar to Battleship ship placement)
- **Size Variety:** Operations range from small 2-square setups (like weapon caches) to large 5-square facilities (like drug manufacturing labs)
- **Complete Discovery Requirement:** Players must investigate and "sweep" ALL squares belonging to an operation to successfully bust it - finding just one square of a 4-square operation means you still need to find the other 3 squares
- **Partial vs. Complete States:** Discovering part of an operation provides confirmation and clues but doesn't remove it from the grid or count toward victory
- **Case Variation:** Different cases feature different quantities of operations, different size distributions, and different thematic operation types

### Investigation Outcome System
Every grid square click produces one of four possible outcomes:

1. **Empty District (Miss):** The investigated square contains no criminal activity, but may generate environmental intelligence clues
2. **Partial Operation Hit:** You've found part of a criminal operation but haven't yet discovered all of its squares
3. **Operation Completion:** You've found the final remaining square of an operation, fully busting it
4. **Previously Investigated:** Clicking an already-investigated square provides a reminder of previous findings but doesn't consume additional sweeps

### Visual State System and Feedback
The grid provides clear visual feedback for all investigation states:

- **Uninvestigated Districts:** Squares appear in black and white with subtle geometric building icons in the background, representing unexplored city districts
- **Investigated Empty Districts:** After investigation, empty squares transition to color, indicating they've been cleared and found to contain no criminal activity
- **Partial Operation Discovery:** When part of an operation is found, those specific squares receive a red border treatment, signaling "you're onto something but haven't found everything yet"
- **Fully Busted Operations:** Once all squares of an operation are discovered, the entire contiguous area receives a green border and a descriptive text label (e.g., "Drug Lab," "Weapons Cache," "Money Laundering Front")
- **Background Aesthetic:** The overall grid maintains a city map appearance using CSS/SVG-generated geometric shapes representing different types of urban buildings and infrastructure

### Intelligence and Clue System
The game provides strategic information to help players make informed decisions:

**Environmental Intelligence from Empty Districts:**
- Proximity-based clues: "Unusual late-night traffic reported nearby" (indicates criminal operation within 1-2 squares)
- Activity-type hints: "Informant reports chemical odors in this area" (suggests drug lab in vicinity)
- Directional intelligence: "Suspicious financial activity detected in this sector" (points toward money laundering operations)
- Geographic clues: "Surveillance cameras show known associates in eastern districts" (narrows search area)

**Partial Hit Confirmation:**
- Encouraging feedback like "You're onto something... keep investigating this area"
- Visual confirmation through red border treatment
- No revelation of total operation size or remaining squares needed

**Periodic Intelligence Updates:**
- Simulated informant tips that appear during gameplay
- Surveillance reports that provide sector-based hints
- Banking or communication intercepts that give directional guidance

This clue system balances providing helpful strategic information while maintaining the deductive challenge - players get enough information to make educated guesses but must still use spatial reasoning and logical deduction to efficiently locate operations.

## Game Structure

### Case System
- **Launch Content:** 3 unique cases
- **Case Selection:** Players can choose any available case (no linear progression)
- **Case Variety:** Each case features different operation types, sizes, and quantities

#### Case Examples:
1. **"The Dockyard Conspiracy"**
   - Focus: Drug smuggling and weapons trafficking
   - Operations: Warehouse labs, shipping containers, safe houses

2. **"Silicon Valley Shadows"**
   - Focus: Cyber crime and corporate espionage
   - Operations: Server farms, data centers, front companies

3. **"Art District Heist"**
   - Focus: Art forgery and money laundering
   - Operations: Forgery studios, auction houses, storage facilities

### Scoring System
- **Combined Score Formula:** `(Time in seconds) + (Sweeps used × 10)`
- **Lower scores are better**
- **Victory Condition:** Bust all operations in the case
- **Failure Condition:** Use all 30 sweeps without completing case

### Save/Resume Functionality
- **Auto-save:** Game state preserved in local storage
- **Resume:** Players can continue interrupted cases
- **Data Stored:** Grid state, sweeps used, timer, discovered operations

### Leaderboard System
- **Local Storage:** Best score per case tracked locally
- **Display:** Best attempt (lowest score) for each case
- **No player names/initials required**

## User Interface Design

### Main Menu
- Case selection screen
- Leaderboard access
- New game / Continue game options

### Game Screen Layout
```
┌─────────────────────────────────────┐
│ Case Title & Status Bar             │
│ Timer: XX:XX | Sweeps: XX/30        │
├─────────────────────────────────────┤
│                                     │
│           10x10 Grid                │
│        (Clickable squares)          │
│                                     │
├─────────────────────────────────────┤
│ Clues & Intelligence Panel          │
│ (Scrollable, chronological)         │
└─────────────────────────────────────┘
```

### Visual Design Elements
- **Grid Squares:** Geometric shapes representing city blocks
- **Building Icons:** Simple CSS/SVG shapes (rectangles, triangles, circles)
- **Color Scheme:** Professional detective/police aesthetic
- **Typography:** Clean, readable fonts suitable for game interface

## Game Flow

### Case Start Sequence
1. Player selects case from menu
2. Case briefing appears with story context
3. Timer starts automatically
4. Player begins investigation by clicking grid squares

### Investigation Loop
1. Player clicks grid square
2. System checks for operations at that location
3. Visual feedback provided immediately
4. Clues/intelligence updated in bottom panel
5. Score tracking updates
6. Repeat until victory or failure

### End Game States
- **Victory:** All operations busted - show final score and leaderboard update
- **Failure:** 30 sweeps used without completion - show discovered operations and final score
- **Options:** Retry case, select new case, view leaderboard

## Performance Requirements

### Response Time
- Grid click response: < 100ms
- Case loading: < 2 seconds
- Save/load operations: < 500ms

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browser support (responsive design)
- No IE support required

## Future Enhancement Considerations

### Potential V2 Features (Not in Scope)
- Difficulty levels
- Multiplayer competitive mode
- Achievement system
- Additional grid sizes
- Sound effects
- Animation effects
- "Getting warmer" visual feedback
- Campaign progression system

## Success Metrics

### Engagement Metrics
- Average session duration
- Case completion rates
- Retry frequency per case

### Performance Metrics
- Load time tracking
- Error rate monitoring
- Local storage utilization

## Development Notes

### Key Technical Considerations
- Efficient grid state management in React
- Responsive SVG/CSS grid rendering
- Local storage data persistence
- Timer implementation with pause/resume
- Random operation placement algorithms for replayability

### Testing Requirements
- Cross-browser compatibility testing
- Mobile responsiveness validation
- Local storage functionality verification
- Game state persistence testing
- Score calculation accuracy validation

---

**Document Version:** 1.0  
**Last Updated:** August 2025  
**Status:** Ready for Development