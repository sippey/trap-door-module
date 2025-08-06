# Minigame Development Guide

This comprehensive guide explains how to create minigames that integrate with the Mystery Escape Game client using iframe communication.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Game State System](#game-state-system)
- [Iframe Communication Protocol](#iframe-communication-protocol)
- [Setting Up Minigames in the Editor](#setting-up-minigames-in-the-editor)
- [Minigame Implementation](#minigame-implementation)
- [Testing Your Minigame](#testing-your-minigame)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

The game client uses an iframe-based architecture where minigames run in isolated iframes and communicate with the parent game client through the `postMessage` API. This approach provides:

- **Security**: Minigames run in sandboxed iframes
- **Flexibility**: Minigames can be hosted anywhere and built with any technology
- **Consistency**: Standardized communication protocol across all minigames
- **State Management**: Centralized game state with sanity tracking

### Key Components

1. **Game Client** (`app/page.tsx`): Main game loop that manages scenes, entities, and game state
2. **MinigameModal** (`components/MinigameModal.tsx`): Handles minigame display and communication
3. **EntityModal** (`components/EntityModal.tsx`): Displays entity information and interaction options
4. **MinigameEditor** (`components/MinigameEditor.tsx`): Editor interface for configuring minigames
5. **Game Data** (`public/gamedata/mystery-manor.json`): Configuration file defining scenes, entities, and minigames

## Game State System

### Core Game State

The game client maintains the following state (defined in `app/page.tsx:12-19`):

```typescript
interface GameState {
  currentSanity: number        // Player's current sanity (0-100)
  currentSceneId: string       // ID of the current scene
  inventory: string[]          // Items the player has collected
  completedMinigames: string[] // IDs of completed minigames
  gameOver: boolean           // Whether the game has ended in failure
  gameWon: boolean            // Whether the game has ended in success
}
```

### Sanity System

Sanity is the core resource management mechanic:

- **Range**: 0-100 (configurable via `config.maxSanity`)
- **Starting Value**: Set in game config (`config.startingSanity`)
- **Interaction Costs**: Each entity interaction has a `sanityCost`
- **Game Over**: Game ends when sanity reaches 0
- **Persistence**: Sanity changes persist across scene transitions

### Entity Types

The game supports three entity types (defined in `types/scene.ts`):

1. **Clue Entities**: Provide story information and consume sanity
2. **Scene Transition Entities**: Move between scenes, may have gating requirements
3. **Minigame Entities**: Launch interactive minigames in iframes

## Iframe Communication Protocol

### Message Flow

```
┌─────────────┐                    ┌──────────────────┐
│   Parent    │                    │     Iframe       │
│ Game Client │                    │   (Minigame)     │
└─────────────┘                    └──────────────────┘
       │                                     │
       │                                     │ 1. Iframe loads
       │                                     │ 2. Sets up listeners
       │                                     │ 3. Detects iframe context
       │                                     │
       │        ◄────── READY ──────────────│ 4. Sends READY message
       │                                     │
       │──────── INIT ─────────►            │ 5. Parent responds with INIT
       │                                     │
       │                                     │ 6. Game starts
       │◄─── SANITY_CHANGE ─────            │ 7. Runtime communication
       │                                     │
       │◄─── GAME_COMPLETE ─────            │ 8. Completion notification
```

### Message Types

#### From Minigame to Parent

**READY Message** (Required - sent when minigame loads):
```typescript
{
  type: 'READY',
  payload: {
    minigameType: string // e.g., 'puzzle', 'arcade', 'memory'
  }
}
```

**SANITY_CHANGE Message** (Optional - when minigame affects player sanity):
```typescript
{
  type: 'SANITY_CHANGE',
  payload: {
    sanityDelta: number // Negative for loss, positive for gain
  }
}
```

**GAME_COMPLETE Message** (Required - when minigame finishes):
```typescript
{
  type: 'GAME_COMPLETE',
  payload: {
    success: boolean,      // Whether player succeeded
    finalAnswer?: string   // Optional completion data
  }
}
```

#### From Parent to Minigame

**INIT Message** (Sent in response to READY):
```typescript
{
  type: 'INIT',
  payload: {
    gameId: string,           // Specific game variant to load
    sanity?: number,          // Current player sanity
    ...customMessageData      // Additional game-specific data
  }
}
```

**UPDATE_SANITY Message** (Sent when sanity changes externally):
```typescript
{
  type: 'UPDATE_SANITY',
  payload: {
    sanity: number // New sanity value
  }
}
```

### Communication Implementation

The parent game client implements communication in `components/MinigameModal.tsx:37-102`:

- Listens for messages from the iframe
- Validates message source for security
- Auto-sends INIT message when READY is received
- Handles sanity changes and game completion
- Provides 5-second timeout for unresponsive minigames

## Setting Up Minigames in the Editor

### 1. Adding Minigames

In the editor (`/editor`), navigate to the Minigames tab:

1. **Global Settings**:
   - Set default sanity value for minigame initialization
   - Enable/disable auto-initialization
   - Configure default message data shared across minigames

2. **Add New Minigame**:
   - **Display Name**: Human-readable name shown to players
   - **URL**: Full URL where the minigame is hosted
   - **Description**: Optional description for players
   - **Display Image**: Optional thumbnail image
   - **Message Data**: Custom key-value pairs sent to the minigame

### 2. Configuring Minigame Entities

In scene entities, set:

```typescript
{
  "id": "unique-entity-id",
  "type": "minigame",
  "x": 400,                                    // Position in scene
  "y": 250,
  "name": "internal-name",
  "minigameId": "your-minigame-id",           // References minigames array
  "customDisplayName": "Player-facing Name",  // Overrides minigame displayName
  "customDescription": "Custom description",  // Overrides minigame description
  "sanityCost": 15,                           // Sanity cost to start minigame
  "customMessageData": {                      // Additional data for this instance
    "difficulty": "hard",
    "variant": "forest"
  }
}
```

### 3. Completion Rewards

Configure rewards in the game client (`app/page.tsx:125-145`):

```typescript
const handleMinigameComplete = (rewards?: any) => {
  if (!selectedEntity) return

  const entity = selectedEntity.entity as MinigameEntity
  
  // Mark as completed
  setGameState(prev => ({ 
    ...prev, 
    completedMinigames: [...prev.completedMinigames, entity.minigameId || entity.id]
  }))

  // Give specific rewards based on minigame
  if (entity.minigameId === 'your-minigame-id') {
    setGameState(prev => ({ 
      ...prev, 
      inventory: [...prev.inventory, 'reward-item'] 
    }))
  }
}
```

## Minigame Implementation

### Basic Structure

Every minigame must implement the communication protocol:

```javascript
// Detect if running in iframe
const isInIframe = window.self !== window.top;

let parentOrigin = null;
let gameInitialized = false;
let currentSanity = 100;

// Message handling
window.addEventListener('message', (event) => {
  const message = event.data;
  
  switch (message.type) {
    case 'INIT':
      handleInit(message.payload);
      parentOrigin = event.origin; // Lock origin after first INIT
      break;
    case 'UPDATE_SANITY':
      currentSanity = message.payload.sanity;
      updateSanityDisplay();
      break;
  }
});

// Send READY message when minigame loads
if (isInIframe) {
  window.parent.postMessage({
    type: 'READY',
    payload: {
      minigameType: 'puzzle' // Your minigame type
    }
  }, '*');
  
  // Fallback timeout
  setTimeout(() => {
    if (!gameInitialized) {
      handleInit({ gameId: 'default', sanity: 100 });
    }
  }, 10000);
}

function handleInit(payload) {
  gameInitialized = true;
  currentSanity = payload.sanity || 100;
  
  // Load specific game variant based on gameId
  loadGame(payload.gameId);
  
  // Initialize UI with current sanity
  updateSanityDisplay();
}

function sendSanityChange(delta) {
  if (isInIframe && parentOrigin) {
    window.parent.postMessage({
      type: 'SANITY_CHANGE',
      payload: {
        sanityDelta: delta
      }
    }, parentOrigin);
  }
}

function completeGame(success, answer = null) {
  if (isInIframe && parentOrigin) {
    window.parent.postMessage({
      type: 'GAME_COMPLETE',
      payload: {
        success: success,
        finalAnswer: answer
      }
    }, parentOrigin);
  }
}
```

### Advanced Features

**Multiple Game Variants**:
```javascript
function loadGame(gameId) {
  switch (gameId) {
    case 'apple-newton':
      initAppleNewtonPuzzle();
      break;
    case 'forest-mystery':
      initForestMystery();
      break;
    default:
      initDefaultGame();
  }
}
```

**Sanity-Based Mechanics**:
```javascript
function makeRiskyChoice() {
  if (currentSanity < 20) {
    // High-risk, high-reward when sanity is low
    if (Math.random() < 0.3) {
      sendSanityChange(30); // Big reward
      showMessage("Your desperation paid off!");
    } else {
      sendSanityChange(-10); // Penalty
      showMessage("Your reckless choice backfired...");
    }
  }
}
```

**Progressive Difficulty**:
```javascript
function getDifficulty() {
  if (currentSanity > 80) return 'easy';
  if (currentSanity > 50) return 'medium';
  return 'hard';
}
```

## Testing Your Minigame

### Using the Test Interface

The game includes a test interface at `/test` for debugging minigame communication:

1. **Load Test Page**: Navigate to `/test` in your browser
2. **Enter Minigame URL**: Input your minigame's URL
3. **Configure Parameters**: Set gameId, initial sanity, and options
4. **Load Minigame**: Click "Load Minigame" to test in a modal
5. **Monitor Communication**: View all messages in the message log
6. **Test Controls**: Use buttons to manually adjust sanity and send messages

### Manual Testing Checklist

- [ ] READY message sent when minigame loads
- [ ] INIT message handled correctly
- [ ] Game loads appropriate variant based on gameId
- [ ] Sanity changes are communicated to parent
- [ ] GAME_COMPLETE sent on success/failure
- [ ] Timeout fallback works when no INIT received
- [ ] Security: Origin validation after first INIT
- [ ] UI updates when sanity changes externally

### Integration Testing

Test your minigame in the full game context:

1. **Add to Game Data**: Configure your minigame in the editor
2. **Create Test Scene**: Add a minigame entity that references your game
3. **Test Full Flow**: Load game → navigate to scene → interact with entity
4. **Verify State**: Check that completion affects game state correctly
5. **Test Rewards**: Ensure completion rewards are granted as expected

## Best Practices

### Security

- **Origin Validation**: Validate parent origin after receiving first INIT message
- **Message Validation**: Check message structure before processing
- **Sanity Bounds**: Clamp sanity values to valid ranges (0-100)
- **Input Sanitization**: Validate all data from parent messages

### Performance

- **Lazy Loading**: Only initialize heavy resources after INIT received
- **Memory Management**: Clean up resources when game completes
- **Responsive Design**: Support different screen sizes for iframe display
- **Loading States**: Show loading indicators while waiting for INIT

### User Experience

- **Timeout Handling**: Provide fallback experience if INIT never comes
- **Sanity Integration**: Make sanity meaningful in your game mechanics
- **Clear Feedback**: Indicate when actions affect sanity
- **Completion Clarity**: Make success/failure states obvious to players

### Code Organization

```javascript
class MinigameCore {
  constructor() {
    this.isInIframe = window.self !== window.top;
    this.parentOrigin = null;
    this.gameState = {
      initialized: false,
      gameId: null,
      sanity: 100
    };
    
    this.setupCommunication();
  }
  
  setupCommunication() {
    window.addEventListener('message', this.handleMessage.bind(this));
    
    if (this.isInIframe) {
      this.sendReady();
    }
  }
  
  // ... rest of implementation
}
```

## Troubleshooting

### Common Issues

**"No READY message received"**:
- Ensure your minigame sends READY immediately when loaded
- Check for JavaScript errors preventing message sending
- Verify iframe sandbox permissions allow scripts

**"No INIT message received, loading default game"**:
- Parent may not be handling READY messages correctly
- Check parent console for errors
- Verify READY message format matches expected structure

**Sanity changes not reflecting in parent**:
- Ensure sanityDelta is a number, not string
- Check that parentOrigin is set before sending messages
- Verify message format matches protocol specification

**Game doesn't load specific variant**:
- Check that gameId is being passed correctly in INIT
- Verify your game variant loading logic
- Ensure fallback to default game works

### Debug Tools

**Console Logging**:
```javascript
function debugLog(message, data = null) {
  console.log(`[Minigame] ${message}`, data);
}

// Use throughout your code
debugLog('READY message sent', { minigameType: 'puzzle' });
debugLog('INIT received', payload);
```

**Message Inspector**:
```javascript
window.addEventListener('message', (event) => {
  console.log('Received message:', {
    origin: event.origin,
    type: event.data.type,
    payload: event.data.payload
  });
});
```

**State Validation**:
```javascript
function validateGameState() {
  const issues = [];
  
  if (!gameInitialized) issues.push('Game not initialized');
  if (currentSanity < 0 || currentSanity > 100) issues.push('Invalid sanity value');
  if (!parentOrigin && isInIframe) issues.push('Parent origin not set');
  
  if (issues.length > 0) {
    console.warn('Game state issues:', issues);
  }
  
  return issues.length === 0;
}
```

### Getting Help

1. **Check Documentation**: Review this guide and the existing iframe communication docs
2. **Use Test Interface**: The `/test` page provides detailed debugging information
3. **Examine Existing Code**: Look at the working minigame example in the game data
4. **Console Debugging**: Use browser dev tools to monitor message flow
5. **Network Analysis**: Check that your minigame URL is accessible and loading correctly

---

This guide provides everything needed to create compatible minigames for the Mystery Escape Game system. The iframe communication protocol ensures consistency while allowing creative freedom in minigame implementation.
