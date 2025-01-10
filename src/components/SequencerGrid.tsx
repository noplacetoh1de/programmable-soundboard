import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DrumSound {
  id: string;
  label: string;
  frequency: number;
  type: OscillatorType;
}

const DRUM_SOUNDS: DrumSound[] = [
  { id: "kick", label: "Kick", frequency: 60, type: "sine" },
  { id: "snare", label: "Snare", frequency: 200, type: "square" },
  { id: "hihat", label: "Hi-Hat", frequency: 1000, type: "triangle" }
];

const STEPS = 16; // 2 bars × 8 steps each

interface SequencerGridProps {
  audioEngine: AudioEngine | null;
  isPlaying: boolean;
  currentStep: number;
}

export const SequencerGrid = ({ audioEngine, isPlaying, currentStep }: SequencerGridProps) => {
  const [grid, setGrid] = useState<Set<string>>(new Set());

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

  // Trigger sound when current step has active notes
  useEffect(() => {
    if (isPlaying && audioEngine) {
      DRUM_SOUNDS.forEach((drum) => {
        const stepId = `${drum.id}-${currentStep}`;
        if (grid.has(stepId)) {
          const soundId = `${drum.id}-${drum.type}`;
          audioEngine.playSound(soundId);
          setTimeout(() => {
            audioEngine.stopSound(soundId);
          }, 100); // Short duration for percussion sounds
        }
      });
    }
  }, [currentStep, isPlaying, audioEngine, grid]);

  return (
    <div className="space-y-2 p-4 bg-secondary rounded-lg">
      <div className="grid grid-cols-[100px_1fr] gap-4">
        <div className="space-y-4">
          {DRUM_SOUNDS.map((drum) => (
            <div key={drum.id} className="h-10 flex items-center">
              {drum.label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-16 gap-1">
          {DRUM_SOUNDS.map((drum) => (
            <div key={drum.id} className="contents">
              {Array.from({ length: STEPS }, (_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className={cn(
                    "w-full h-10 p-0",
                    grid.has(`${drum.id}-${i}`) && "bg-neon-muted border-neon",
                    currentStep === i && isPlaying && "ring-2 ring-primary"
                  )}
                  onClick={() => toggleStep(drum.id, i)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};