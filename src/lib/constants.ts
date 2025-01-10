export const NOTES = [60, 62, 64, 65, 67, 69, 71, 72];
export const WAVEFORMS: OscillatorType[] = ["sine", "square", "sawtooth"];

export const DRUM_SOUNDS = [
  { id: "kick", label: "Kick", frequency: 40, type: "sine" as OscillatorType },  // Lower frequency for deeper kick
  { id: "snare", label: "Snare", frequency: 150, type: "triangle" as OscillatorType },  // Changed to triangle wave for snappier sound
  { id: "hihat", label: "Hi-Hat", frequency: 2000, type: "square" as OscillatorType }  // Higher frequency and square wave for metallic sound
];