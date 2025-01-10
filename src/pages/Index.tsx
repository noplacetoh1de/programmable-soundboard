import { useState, useCallback, useEffect } from "react";
import { SoundGrid } from "@/components/sound/SoundGrid";
import { Sequencer } from "@/components/Sequencer";
import { SequencerGrid } from "@/components/SequencerGrid";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const audioEngine = useAudioEngine();
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [step, setStep] = useState(0);
  const { toast } = useToast();

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
      setStep((prev) => (prev + 1) % 16);
    }, (60 / tempo) * 1000 / 2);

    return () => clearInterval(interval);
  }, [isPlaying, tempo]);

  const handlePlayPause = () => {
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
      
      <SoundGrid
        activeNotes={activeNotes}
        onToggleNote={toggleNote}
      />

      <SequencerGrid
        audioEngine={audioEngine}
        isPlaying={isPlaying}
        currentStep={step}
      />
    </div>
  );
};

export default Index;