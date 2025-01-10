import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Square, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SequencerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  tempo: number;
  onTempoChange: (value: number) => void;
}

export const Sequencer = ({
  isPlaying,
  onPlayPause,
  onReset,
  tempo,
  onTempoChange,
}: SequencerProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
      <Button
        variant="outline"
        size="icon"
        onClick={onPlayPause}
        className={cn(
          "w-12 h-12",
          isPlaying && "border-neon text-neon"
        )}
      >
        {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="w-12 h-12"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-4">
        <span className="text-sm">Tempo</span>
        <Slider
          value={[tempo]}
          onValueChange={(values) => onTempoChange(values[0])}
          min={60}
          max={180}
          step={1}
          className="w-32"
        />
        <span className="text-sm w-12">{tempo} BPM</span>
      </div>
    </div>
  );
};