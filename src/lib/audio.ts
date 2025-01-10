export class AudioEngine {
  private context: AudioContext | null;
  private oscillators: Map<string, OscillatorNode>;
  private gains: Map<string, GainNode>;

  constructor() {
    // Initialize as null, we'll create it on first user interaction
    this.context = null;
    this.oscillators = new Map();
    this.gains = new Map();
  }

  private async initializeContext() {
    if (!this.context) {
      this.context = new AudioContext();
    }
    
    if (this.context.state === 'suspended') {
      try {
        await this.context.resume();
      } catch (error) {
        console.warn('Failed to resume AudioContext:', error);
      }
    }
  }

  async createSound(id: string, type: OscillatorType, frequency: number) {
    await this.initializeContext();
    if (!this.context) return;

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    
    gain.gain.setValueAtTime(0, this.context.currentTime);
    
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    
    oscillator.start();
    
    this.oscillators.set(id, oscillator);
    this.gains.set(id, gain);
  }

  async playSound(id: string, gainValue: number = 0.3) {
    await this.initializeContext();
    const gain = this.gains.get(id);
    if (gain && this.context) {
      gain.gain.setValueAtTime(gainValue, this.context.currentTime);
    }
  }

  async stopSound(id: string) {
    await this.initializeContext();
    const gain = this.gains.get(id);
    if (gain && this.context) {
      gain.gain.setValueAtTime(0, this.context.currentTime);
    }
  }

  async setGain(id: string, value: number) {
    await this.initializeContext();
    const gain = this.gains.get(id);
    if (gain && this.context) {
      gain.gain.setValueAtTime(value, this.context.currentTime);
    }
  }

  cleanup(id: string) {
    const oscillator = this.oscillators.get(id);
    const gain = this.gains.get(id);
    
    if (oscillator && gain) {
      oscillator.stop();
      oscillator.disconnect();
      gain.disconnect();
      
      this.oscillators.delete(id);
      this.gains.delete(id);
    }
  }
}

export const createNoteFrequency = (note: number): number => {
  return 440 * Math.pow(2, (note - 69) / 12);
};