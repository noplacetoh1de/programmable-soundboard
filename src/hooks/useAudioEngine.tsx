import { useState, useEffect } from "react";
import { AudioEngine } from "@/lib/audio";
import { NOTES, WAVEFORMS, DRUM_SOUNDS } from "@/lib/constants";

export const useAudioEngine = () => {
  const [audioEngine, setAudioEngine] = useState<AudioEngine | null>(null);

  useEffect(() => {
    const engine = new AudioEngine();
    setAudioEngine(engine);

    // Initialize all possible sounds
    NOTES.forEach((note) => {
      WAVEFORMS.forEach((waveform) => {
        const id = `${note}-${waveform}`;
        engine.createSound(id, waveform, createNoteFrequency(note));
      });
    });

    // Initialize drum sounds
    DRUM_SOUNDS.forEach((drum) => {
      const id = `${drum.id}-${drum.type}`;
      engine.createSound(id, drum.type, drum.frequency);
    });

    return () => {
      // Cleanup all sounds
      NOTES.forEach((note) => {
        WAVEFORMS.forEach((waveform) => {
          engine.cleanup(`${note}-${waveform}`);
        });
      });
      DRUM_SOUNDS.forEach((drum) => {
        engine.cleanup(`${drum.id}-${drum.type}`);
      });
    };
  }, []);

  return audioEngine;
};

const createNoteFrequency = (note: number): number => {
  return 440 * Math.pow(2, (note - 69) / 12);
};