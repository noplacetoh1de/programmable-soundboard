import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AudioEngine } from "@/lib/audio";

interface DrumSound {
  id: string;
  label: string;
  frequency: number;
  type: OscillatorType;
}

const DRUM_SOUNDS: DrumSound[] = [
  { id: "kick", label: "Kick", frequency: 40, type: "sine" },
  { id: "snare", label: "Snare", frequency: 150, type: "triangle" },
  { id: "hihat", label: "Hi-Hat", frequency: 2000, type: "square" }
];

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

  // Trigger sound when current step has active notes
  useEffect(() => {
    if (isPlaying && audioEngine) {
      DRUM_SOUNDS.forEach((drum) => {
        const stepId = `${drum.id}-${currentStep}`;
        if (grid.has(stepId)) {
          const soundId = `${drum.id}-${drum.type}`;
          audioEngine.playSound(soundId, gains[drum.id]);
          
          // Adjust duration based on drum type
          const duration = drum.id === 'hihat' ? 50 : 100; // Shorter duration for hi-hat
          
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
        <div className="space-y-4">
          {DRUM_SOUNDS.map((drum) => (
            <div key={drum.id} className="h-10 flex items-center">
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={gains[drum.id]}
                onChange={(e) => handleGainChange(drum.id, e.target.value)}
                className="w-20 h-8"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};