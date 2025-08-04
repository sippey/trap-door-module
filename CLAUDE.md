# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based locked room puzzle game where players must find a hidden trap door. It's a simplified puzzle game using a 10x10 grid where players have limited "sweeps" to discover the single trap door's location.

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (copies dev config, runs on http://localhost:3000)

# Building
npm run build            # Build for production (copies prod config, creates static export)

# Code Quality
npm run lint             # Run ESLint for TypeScript/JavaScript files

# Start Production Server
npm start                # Start production server (after build)
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14.2.5 with App Router
- **Language**: TypeScript (mixed with some JavaScript components)
- **Styling**: Tailwind CSS + CSS Modules
- **Database**: Prisma ORM with SQLite (schema in /prisma)
- **State Management**: React hooks with localStorage persistence

### Key Architectural Patterns

1. **Game State Management**: The main game logic resides in `app/page.tsx`, using React hooks to manage complex game state including grid state, clues, operations, and scoring.

2. **Component Architecture**: 
   - Layout components in `/components/` handle UI structure
   - Game logic utilities in `/lib/` provide core functionality
   - Modular CSS in `/styles/` for component-specific styling

3. **Data Flow**:
   - Game state is managed client-side with localStorage for persistence
   - No backend API required - all game logic runs in the browser
   - Leaderboard and save states use localStorage

4. **Configuration Management**:
   - Dual Next.js configs: `next.config.dev.js` (development) and `next.config.prod.js` (static export for GitHub Pages)
   - Build scripts automatically copy the appropriate config

### Critical Files for Understanding the Codebase

- `app/page.tsx`: Main game component with all state management and game loop logic
- `lib/gameState.ts`: Core TypeScript interfaces and types defining the game structure
- `lib/cases.ts`: Game scenario definitions and operation configurations
- `lib/gameUtils.ts`: Utility functions for grid operations, clue generation, and game mechanics
- `components/Grid.tsx`: Interactive game grid component handling user clicks

### Game Mechanics Context

The game implements a locked room puzzle where players:
1. Have 30 "taps" to search a 10x10 grid representing the room floor
2. Must find the single hidden trap door to win
3. Will have an Intel system for hints (mechanism TBD)
4. Are scored based on time and taps used (lower is better)

When modifying game logic, ensure compatibility with the save/load system that uses localStorage keys: 'trapDoorGameSave' and 'trapDoorGameLeaderboard'.

## Simplification Plan

### Key Changes from Original Game:
1. **Single Level**: Remove the 3-case system, have just one locked room puzzle
2. **One Trap Door**: Instead of multiple criminal operations, find a single trap door
3. **Simplified Theme**: From crime investigation to escape room puzzle
4. **Intel System**: Keep the infrastructure but implement new hint mechanism later

### Files Requiring Major Changes:
- `lib/cases.ts`: Remove multi-case system, create single room configuration
- `app/page.tsx`: Simplify game state for single trap door instead of operations
- `lib/gameUtils.ts`: Update grid logic for single target instead of multiple operations
- `components/MainMenu.tsx`: Remove case selection
- `components/CaseBriefingModal.tsx`: Simplify or repurpose for room intro
- `components/OperationChecklist.tsx`: Remove or replace with simpler progress indicator

### Terminology Updates Needed:
- "Operations" → "Trap Door"
- "Criminal activities" → "Hidden trap door"
- "Investigation" → "Search"
- "Sweeps" → "Taps"
- "Detective" → "Player"