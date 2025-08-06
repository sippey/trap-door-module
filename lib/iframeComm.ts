// Iframe Communication Module for Parent Game Integration

export interface IframeCommState {
  isInIframe: boolean;
  parentOrigin: string | null;
  gameInitialized: boolean;
  onSanityUpdate?: (sanity: number) => void;
  onGameComplete?: (success: boolean, finalAnswer?: string) => void;
}

export class IframeComm {
  private state: IframeCommState;

  constructor() {
    this.state = {
      isInIframe: typeof window !== 'undefined' ? window.self !== window.top : false,
      parentOrigin: null,
      gameInitialized: false,
    };

    // Only setup communication on client-side
    if (typeof window !== 'undefined') {
      this.setupCommunication();
    }
  }

  private setupCommunication() {
    // Listen for messages from parent
    window.addEventListener('message', this.handleMessage.bind(this));

    // Send READY message if in iframe
    if (this.state.isInIframe) {
      this.sendReady();
      
      // Fallback timeout - initialize with defaults if no INIT received
      setTimeout(() => {
        if (!this.state.gameInitialized) {
          this.handleInit({ gameId: 'default', sanity: 100 });
        }
      }, 10000);
    } else {
      // Not in iframe - initialize immediately with defaults
      this.handleInit({ gameId: 'default', sanity: 100 });
    }
  }

  private handleMessage(event: MessageEvent) {
    const message = event.data;
    
    switch (message.type) {
      case 'INIT':
        this.handleInit(message.payload);
        this.state.parentOrigin = event.origin; // Lock origin after first INIT
        break;
      case 'UPDATE_SANITY':
        if (this.state.onSanityUpdate) {
          this.state.onSanityUpdate(message.payload.sanity);
        }
        break;
    }
  }

  private handleInit(payload: any) {
    this.state.gameInitialized = true;
    
    // Notify game of initialization with sanity value
    if (this.state.onSanityUpdate) {
      this.state.onSanityUpdate(payload.sanity || 100);
    }
  }

  private sendReady() {
    if (this.state.isInIframe && typeof window !== 'undefined') {
      window.parent.postMessage({
        type: 'READY',
        payload: {
          minigameType: 'puzzle'
        }
      }, '*');
    }
  }

  public sendSanityChange(delta: number) {
    if (this.state.isInIframe && this.state.parentOrigin && typeof window !== 'undefined') {
      window.parent.postMessage({
        type: 'SANITY_CHANGE',
        payload: {
          sanityDelta: delta
        }
      }, this.state.parentOrigin);
    }
  }

  public sendGameComplete(success: boolean, finalAnswer?: string) {
    if (this.state.isInIframe && this.state.parentOrigin && typeof window !== 'undefined') {
      window.parent.postMessage({
        type: 'GAME_COMPLETE',
        payload: {
          success: success,
          finalAnswer: finalAnswer
        }
      }, this.state.parentOrigin);
    }
    
    // Also call local handler
    if (this.state.onGameComplete) {
      this.state.onGameComplete(success, finalAnswer);
    }
  }

  public setOnSanityUpdate(callback: (sanity: number) => void) {
    this.state.onSanityUpdate = callback;
  }

  public setOnGameComplete(callback: (success: boolean, finalAnswer?: string) => void) {
    this.state.onGameComplete = callback;
  }

  public isInIframe(): boolean {
    return this.state.isInIframe;
  }

  public isInitialized(): boolean {
    return this.state.gameInitialized;
  }
}

// Global instance
export const iframeComm = new IframeComm();