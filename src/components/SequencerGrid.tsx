import { useState, useCallback, useEffect } from "react";
import { DrumControl } from "./DrumControl";
import { DrumGridRow } from "./DrumGridRow";
import { AudioEngine } from "@/lib/audio";
import { DRUM_SOUNDS } from "@/lib/constants";

const STEPS = 16;

interface SequencerGridProps {
  audioEngine: AudioEngine | null;
  isPlaying: boolean;
  currentStep: number;
}

export const SequencerGrid = ({ audioEngine, isPlaying, currentStep }: SequencerGridProps) => {
  const [grid, setGrid] = useState<Set<string>>(new Set());
  const [gains, setGains] = useState({
    kick: 0.3,
    snare: 0.4,
    hihat: 0.2
  });

  const toggleStep = useCallback((drumId: string, step: number) => {
    const stepId = `${drumId}-${step}`;
    setGrid((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  }, []);

  const handleGainChange = (drumId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      setGains(prev => ({
        ...prev,
        [drumId]: numValue
      }));
      if (audioEngine) {
        audioEngine.setGain(`${drumId}-${DRUM_SOUNDS.find(d => d.id === drumId)?.type}`, numValue);
      }
    }
  };

  useEffect(() => {
    if (isPlaying && audioEngine) {
      DRUM_SOUNDS.forEach((drum) => {
        const stepId = `${drum.id}-${currentStep}`;
        if (grid.has(stepId)) {
          const soundId = `${drum.id}-${drum.type}`;
          audioEngine.playSound(soundId, gains[drum.id]);
          
          const duration = drum.id === 'hihat' ? 50 : 100;
          
          setTimeout(() => {
            audioEngine.stopSound(soundId);
          }, duration);
        }
      });
    }
  }, [currentStep, isPlaying, audioEngine, grid, gains]);

  return (
    <div className="space-y-2 p-4 bg-secondary rounded-lg">
      <div className="grid grid-cols-[100px_1fr_100px] gap-4">
        <div className="space-y-4">
          {DRUM_SOUNDS.map((drum) => (
            <DrumControl
              key={drum.id}
              drum={drum}
              gain={gains[drum.id]}
              onGainChange={(value) => handleGainChange(drum.id, value)}
            />
          ))}
        </div>
        <div className="grid grid-cols-16 gap-1">
          {DRUM_SOUNDS.map((drum) => (
            <DrumGridRow
              key={drum.id}
              drum={drum}
              steps={STEPS}
              activeSteps={grid}
              currentStep={currentStep}
              isPlaying={isPlaying}
              onToggleStep={(step) => toggleStep(drum.id, step)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};