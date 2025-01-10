import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SoundButtonProps {
  id: string;
  isPlaying: boolean;
  onTrigger: () => void;
  label: string;
}

export const SoundButton = ({ id, isPlaying, onTrigger, label }: SoundButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-20 h-20 rounded-lg border-2 transition-all duration-200",
        isPlaying && "border-neon bg-neon-muted animate-button-press"
      )}
      onClick={onTrigger}
    >
      {label}
    </Button>
  );
};