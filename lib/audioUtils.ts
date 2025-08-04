// Audio utility for playing random knock sounds
export class AudioManager {
  private knockSounds: HTMLAudioElement[] = [];
  private doorOpenSound: HTMLAudioElement | null = null;
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
    
    // Create audio elements for each knock sound
    for (let i = 1; i <= 4; i++) {
      const audio = new Audio(`${basePath}/knocks/knock-${i}.mp3`);
      audio.preload = 'auto';
      audio.volume = 0.7; // Set volume to 70%
      this.knockSounds.push(audio);
    }

    // Create audio element for door opening sound
    this.doorOpenSound = new Audio(`${basePath}/knocks/door-open.mp3`);
    this.doorOpenSound.preload = 'auto';
    this.doorOpenSound.volume = 0.8; // Slightly louder for dramatic effect

    this.isInitialized = true;
  }

  public playRandomKnock() {
    if (!this.isInitialized || this.knockSounds.length === 0) {
      return;
    }

    try {
      // Select a random knock sound first
      const randomIndex = Math.floor(Math.random() * this.knockSounds.length);
      const selectedAudio = this.knockSounds[randomIndex];

      // Stop all OTHER currently playing sounds (not the selected one)
      this.knockSounds.forEach((audio, index) => {
        if (index !== randomIndex && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      
      // Reset the selected audio to the beginning
      selectedAudio.currentTime = 0;
      
      // Play the sound
      selectedAudio.play().catch(() => {
        // Silently handle audio play failures
      });
    } catch (error) {
      // Silently handle errors
    }
  }

  public playDoorOpen() {
    if (!this.isInitialized || !this.doorOpenSound) {
      return;
    }

    try {
      // Stop any currently playing knock sounds
      this.knockSounds.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });

      // Reset and play the door opening sound
      this.doorOpenSound.currentTime = 0;
      this.doorOpenSound.play().catch(() => {
        // Silently handle audio play failures
      });
    } catch (error) {
      // Silently handle errors
    }
  }

  public setVolume(volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.knockSounds.forEach(audio => {
      audio.volume = clampedVolume;
    });
    if (this.doorOpenSound) {
      this.doorOpenSound.volume = clampedVolume;
    }
  }
}

// Create a singleton instance
export const audioManager = new AudioManager();