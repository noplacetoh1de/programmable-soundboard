export const NOTES = [60, 62, 64, 65, 67, 69, 71, 72];
export const WAVEFORMS: OscillatorType[] = ["sine", "square", "triangle", "sawtooth"];

export const DRUM_SOUNDS = [
  { id: "kick", label: "Kick", frequency: 60, type: "sine" as OscillatorType },
  { id: "snare", label: "Snare", frequency: 200, type: "square" as OscillatorType },
  { id: "hihat", label: "Hi-Hat", frequency: 1000, type: "triangle" as OscillatorType }
];