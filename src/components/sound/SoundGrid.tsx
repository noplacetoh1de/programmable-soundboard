import { NOTES, WAVEFORMS } from "@/lib/constants";
import { SoundButton } from "@/components/SoundButton";
import { Input } from "@/components/ui/input";

interface SoundGridProps {
  activeNotes: Set<string>;
  onToggleNote: (id: string) => void;
  waveGains: Record<string, number>;
  onWaveGainChange: (waveform: string, value: string) => void;
}

export const SoundGrid = ({ activeNotes, onToggleNote, waveGains, onWaveGainChange }: SoundGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {WAVEFORMS.map((waveform) => (
        <div key={waveform} className="space-y-4">
          <div className="flex items-center gap-4 justify-between">
            <h2 className="text-xl font-semibold capitalize">{waveform} Wave</h2>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={waveGains[waveform]}
              onChange={(e) => onWaveGainChange(waveform, e.target.value)}
              className="w-20 h-8"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {NOTES.map((note) => {
              const id = `${note}-${waveform}`;
              return (
                <SoundButton
                  key={id}
                  id={id}
                  isPlaying={activeNotes.has(id)}
                  onTrigger={() => onToggleNote(id)}
                  label={`${note}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};