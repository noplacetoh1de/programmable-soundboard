import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DrumSound } from "@/lib/types";

interface DrumGridRowProps {
  drum: DrumSound;
  steps: number;
  activeSteps: Set<string>;
  currentStep: number;
  isPlaying: boolean;
  onToggleStep: (step: number) => void;
}

export const DrumGridRow = ({
  drum,
  steps,
  activeSteps,
  currentStep,
  isPlaying,
  onToggleStep,
}: DrumGridRowProps) => {
  return (
    <div className="contents">
      {Array.from({ length: steps }, (_, i) => (
        <Button
          key={i}
          variant="outline"
          className={cn(
            "w-full h-10 p-0",
            activeSteps.has(`${drum.id}-${i}`) && "bg-neon-muted border-neon",
            currentStep === i && isPlaying && "ring-2 ring-primary"
          )}
          onClick={() => onToggleStep(i)}
        />
      ))}
    </div>
  );
};