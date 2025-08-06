// Iframe Communication Module for Parent Game Integration

export interface IframeCommState {
  isInIframe: boolean;
  parentOrigin: string | null;
  gameInitialized: boolean;
  initialSanity: number;
  onSanityUpdate?: (sanity: number) => void;
  onGameComplete?: (success: boolean, finalAnswer?: string) => void;
  onInit?: (sanity: number) => void;
}

export class IframeComm {
  private state: IframeCommState;

  constructor() {
    this.state = {
      isInIframe: typeof window !== 'undefined' ? window.self !== window.top : false,
      parentOrigin: null,
      gameInitialized: false,
      initialSanity: 100, // Default sanity
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
      
      // Don't auto-initialize in iframe - wait for INIT message
      // Fallback timeout - initialize with defaults if no INIT received
      setTimeout(() => {
        if (!this.state.gameInitialized) {
          console.log('No INIT message received after 10 seconds, using default sanity');
          this.handleInit({ gameId: 'default', sanity: 100 });
        }
      }, 10000);
    } else {
      // Not in iframe - initialize immediately with defaults
      this.state.gameInitialized = true;
      this.state.initialSanity = 100;
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
    console.log('Received INIT message with payload:', payload);
    this.state.gameInitialized = true;
    this.state.initialSanity = payload.sanity || 100;
    
    // Notify game of initialization
    if (this.state.onInit) {
      this.state.onInit(this.state.initialSanity);
    }
    
    // Also update current sanity
    if (this.state.onSanityUpdate) {
      this.state.onSanityUpdate(this.state.initialSanity);
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

  public setOnInit(callback: (sanity: number) => void) {
    this.state.onInit = callback;
  }

  public isInIframe(): boolean {
    return this.state.isInIframe;
  }

  public isInitialized(): boolean {
    return this.state.gameInitialized;
  }

  public getInitialSanity(): number {
    return this.state.initialSanity;
  }
}

// Global instance
export const iframeComm = new IframeComm();