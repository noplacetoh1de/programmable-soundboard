import { NOTES, WAVEFORMS } from "@/lib/constants";
import { SoundButton } from "@/components/SoundButton";

interface SoundGridProps {
  activeNotes: Set<string>;
  onToggleNote: (id: string) => void;
}

export const SoundGrid = ({ activeNotes, onToggleNote }: SoundGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {WAVEFORMS.map((waveform) => (
        <div key={waveform} className="space-y-4">
          <h2 className="text-xl font-semibold capitalize">{waveform} Wave</h2>
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