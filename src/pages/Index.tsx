import { useState, useEffect, useCallback } from "react";
import { SoundButton } from "@/components/SoundButton";
import { Sequencer } from "@/components/Sequencer";
import { SequencerGrid } from "@/components/SequencerGrid";
import { AudioEngine, createNoteFrequency } from "@/lib/audio";
import { useToast } from "@/components/ui/use-toast";

const NOTES = [60, 62, 64, 65, 67, 69, 71, 72];
const WAVEFORMS: OscillatorType[] = ["sine", "square", "triangle", "sawtooth"];

const DRUM_SOUNDS = [
  { id: "kick", label: "Kick", frequency: 60, type: "sine" as OscillatorType },
  { id: "snare", label: "Snare", frequency: 200, type: "square" as OscillatorType },
  { id: "hihat", label: "Hi-Hat", frequency: 1000, type: "triangle" as OscillatorType }
];

const Index = () => {
  const [audioEngine, setAudioEngine] = useState<AudioEngine | null>(null);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [step, setStep] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const engine = new AudioEngine();
    setAudioEngine(engine);

    // Initialize all possible sounds (including drum sounds)
    NOTES.forEach((note) => {
      WAVEFORMS.forEach((waveform) => {
        const id = `${note}-${waveform}`;
        engine.createSound(id, waveform, createNoteFrequency(note));
      });
    });

    // Initialize drum sounds
    ["kick", "snare", "hihat"].forEach((drumId) => {
      const drum = DRUM_SOUNDS.find(d => d.id === drumId);
      if (drum) {
        const id = `${drumId}-${drum.type}`;
        engine.createSound(id, drum.type, drum.frequency);
      }
    });

    return () => {
      // Cleanup all sounds
      NOTES.forEach((note) => {
        WAVEFORMS.forEach((waveform) => {
          engine.cleanup(`${note}-${waveform}`);
        });
      });
      ["kick", "snare", "hihat"].forEach((drumId) => {
        const drum = DRUM_SOUNDS.find(d => d.id === drumId);
        if (drum) {
          engine.cleanup(`${drumId}-${drum.type}`);
        }
      });
    };
  }, []);

  const toggleNote = useCallback((id: string) => {
    if (!audioEngine) return;

    if (activeNotes.has(id)) {
      audioEngine.stopSound(id);
      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      audioEngine.playSound(id);
      setActiveNotes((prev) => new Set(prev).add(id));
    }
  }, [audioEngine, activeNotes]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 16); // Changed to 16 steps (2 bars × 8 steps)
    }, (60 / tempo) * 1000 / 2); // Divided by 2 for eighth notes

    return () => clearInterval(interval);
  }, [isPlaying, tempo]);

  const handlePlayPause = () => {
    if (!isPlaying && activeNotes.size === 0) {
      toast({
        title: "No sounds selected",
        description: "Click some buttons to create a sequence first!",
      });
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
    activeNotes.forEach((id) => {
      audioEngine?.stopSound(id);
    });
    setActiveNotes(new Set());
  };

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8">
      <h1 className="text-4xl font-bold text-center">Programmable Soundboard</h1>
      
      <Sequencer
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        tempo={tempo}
        onTempoChange={setTempo}
      />
      
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
                    onTrigger={() => toggleNote(id)}
                    label={`${note}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <SequencerGrid
        audioEngine={audioEngine}
        isPlaying={isPlaying}
        currentStep={step}
      />
    </div>
  );
};

export default Index;
