export class AudioEngine {
  private context: AudioContext;
  private oscillators: Map<string, OscillatorNode>;
  private gains: Map<string, GainNode>;

  constructor() {
    this.context = new AudioContext();
    this.oscillators = new Map();
    this.gains = new Map();
  }

  createSound(id: string, type: OscillatorType, frequency: number) {
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

  playSound(id: string) {
    const gain = this.gains.get(id);
    if (gain) {
      gain.gain.setValueAtTime(0.3, this.context.currentTime);
    }
  }

  stopSound(id: string) {
    const gain = this.gains.get(id);
    if (gain) {
      gain.gain.setValueAtTime(0, this.context.currentTime);
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