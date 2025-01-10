export const NOTES = [60, 62, 64, 65, 67, 69, 71, 72];
export const WAVEFORMS: OscillatorType[] = ["sine", "square", "triangle", "sawtooth"];

export const DRUM_SOUNDS = [
  { id: "kick", label: "Kick", frequency: 40, type: "sine" as OscillatorType },  // Lower frequency for deeper kick
  { id: "snare", label: "Snare", frequency: 800, type: "sawtooth" as OscillatorType },  // Higher frequency with sawtooth for noise-like sound
  { id: "hihat", label: "Hi-Hat", frequency: 2000, type: "square" as OscillatorType }  // Higher frequency and square wave for metallic sound
];