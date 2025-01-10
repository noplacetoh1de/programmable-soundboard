import { Input } from "@/components/ui/input";
import { DrumSound } from "@/lib/types";

interface DrumControlProps {
  drum: DrumSound;
  gain: number;
  onGainChange: (value: string) => void;
}

export const DrumControl = ({ drum, gain, onGainChange }: DrumControlProps) => {
  return (
    <div className="flex items-center h-10">
      <Input
        type="number"
        min="0"
        max="1"
        step="0.1"
        value={gain}
        onChange={(e) => onGainChange(e.target.value)}
        className="w-20 h-8"
      />
    </div>
  );
};