/**
 * Sound Utilities for Audio Feedback
 * Provides simple audio feedback for user actions
 */

class SoundManager {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.volume = 0.3;

    // Initialize Web Audio API context on first user interaction
    this.initContext();
  }

  initContext() {
    if (typeof AudioContext !== 'undefined') {
      this.context = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
      this.context = new webkitAudioContext();
    }
  }

  /**
   * Resume audio context if suspended (required by browser autoplay policies)
   */
  async resumeContext() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  /**
   * Play a simple tone
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in ms
   * @param {string} type - Oscillator type: 'sine', 'square', 'sawtooth', 'triangle'
   */
  async playTone(frequency, duration, type = 'sine') {
    if (!this.enabled || !this.context) return;

    await this.resumeContext();

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(this.volume, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.context.currentTime + duration / 1000
    );

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration / 1000);
  }

  /**
   * Play success sound - upward ascending tones
   */
  async playSuccess() {
    if (!this.enabled || !this.context) return;

    await this.resumeContext();

    const notes = [
      { freq: 523.25, delay: 0 },     // C5
      { freq: 659.25, delay: 100 },   // E5
      { freq: 783.99, delay: 200 }    // G5
    ];

    notes.forEach(({ freq, delay }) => {
      setTimeout(() => this.playTone(freq, 150, 'sine'), delay);
    });
  }

  /**
   * Play error sound - descending tone
   */
  async playError() {
    if (!this.enabled || !this.context) return;

    await this.resumeContext();

    const notes = [
      { freq: 392.00, delay: 0 },     // G4
      { freq: 329.63, delay: 100 }    // E4
    ];

    notes.forEach(({ freq, delay }) => {
      setTimeout(() => this.playTone(freq, 200, 'triangle'), delay);
    });
  }

  /**
   * Play neutral click sound
   */
  async playClick() {
    if (!this.enabled || !this.context) return;

    await this.resumeContext();
    this.playTone(800, 50, 'square');
  }

  /**
   * Play celebration sound for streaks
   */
  async playCelebration() {
    if (!this.enabled || !this.context) return;

    await this.resumeContext();

    const notes = [
      { freq: 523.25, delay: 0 },     // C5
      { freq: 659.25, delay: 80 },    // E5
      { freq: 783.99, delay: 160 },   // G5
      { freq: 1046.50, delay: 240 }   // C6
    ];

    notes.forEach(({ freq, delay }) => {
      setTimeout(() => this.playTone(freq, 200, 'sine'), delay);
    });
  }

  /**
   * Enable or disable sounds
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Set volume level
   * @param {number} volume - Volume level (0.0 to 1.0)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Check if sounds are supported
   * @returns {boolean}
   */
  isSupported() {
    return this.context !== null;
  }
}

// Create singleton instance
const soundManager = new SoundManager();

// Export convenience functions
export const playSuccess = () => soundManager.playSuccess();
export const playError = () => soundManager.playError();
export const playClick = () => soundManager.playClick();
export const playCelebration = () => soundManager.playCelebration();
export const setSoundsEnabled = (enabled) => soundManager.setEnabled(enabled);
export const setSoundVolume = (volume) => soundManager.setVolume(volume);
export const isSoundSupported = () => soundManager.isSupported();

export default soundManager;
