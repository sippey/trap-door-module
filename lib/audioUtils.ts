// Audio utility for playing specific beep sounds and hydraulic effects
export class AudioManager {
  private failureBeep: HTMLAudioElement | null = null;
  private successBeep: HTMLAudioElement | null = null;
  private hydraulicOpenSound: HTMLAudioElement | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.initializeAudio();
    }
  }

  private initializeAudio() {
    // Get the base path for assets (empty for dev, /trap-door-module for production)
    const basePath = process.env.NODE_ENV === 'production' ? '/trap-door-module' : '';
    
    // Create audio elements for specific beep sounds
    this.failureBeep = new Audio(`${basePath}/knocks/beep-1.mp3`);
    this.failureBeep.preload = 'auto';
    this.failureBeep.volume = 0.7;

    this.successBeep = new Audio(`${basePath}/knocks/beep-2.mp3`);
    this.successBeep.preload = 'auto';
    this.successBeep.volume = 0.7;

    // Create audio element for hydraulic opening sound
    this.hydraulicOpenSound = new Audio(`${basePath}/knocks/hydraulic-open.mp3`);
    this.hydraulicOpenSound.preload = 'auto';
    this.hydraulicOpenSound.volume = 0.8; // Slightly louder for dramatic effect

    this.isInitialized = true;
  }

  public playFailureBeep() {
    if (!this.isInitialized || !this.failureBeep) {
      return;
    }

    try {
      // Stop any currently playing sounds
      this.stopAllSounds();
      
      // Reset and play the failure beep
      this.failureBeep.currentTime = 0;
      this.failureBeep.play().catch(() => {
        // Silently handle audio play failures
      });
    } catch (error) {
      // Silently handle errors
    }
  }

  public playSuccessBeep() {
    if (!this.isInitialized || !this.successBeep) {
      return;
    }

    try {
      // Stop any currently playing sounds
      this.stopAllSounds();
      
      // Reset and play the success beep
      this.successBeep.currentTime = 0;
      this.successBeep.play().catch(() => {
        // Silently handle audio play failures
      });
    } catch (error) {
      // Silently handle errors
    }
  }

  private stopAllSounds() {
    [this.failureBeep, this.successBeep].forEach(audio => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }

  public playHydraulicOpen() {
    if (!this.isInitialized || !this.hydraulicOpenSound) {
      return;
    }

    try {
      // Stop any currently playing beep sounds
      this.stopAllSounds();

      // Reset and play the hydraulic opening sound
      this.hydraulicOpenSound.currentTime = 0;
      this.hydraulicOpenSound.play().catch(() => {
        // Silently handle audio play failures
      });
    } catch (error) {
      // Silently handle errors
    }
  }

  public setVolume(volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    [this.failureBeep, this.successBeep].forEach(audio => {
      if (audio) {
        audio.volume = clampedVolume;
      }
    });
    if (this.hydraulicOpenSound) {
      this.hydraulicOpenSound.volume = clampedVolume;
    }
  }
}

// Create a singleton instance
export const audioManager = new AudioManager();