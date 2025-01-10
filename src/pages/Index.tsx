import { useState, useCallback, useEffect } from "react";
import { SoundGrid } from "@/components/sound/SoundGrid";
import { Sequencer } from "@/components/Sequencer";
import { SequencerGrid } from "@/components/SequencerGrid";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { WAVEFORMS } from "@/lib/constants";

const Index = () => {
  const audioEngine = useAudioEngine();
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const [waveGains, setWaveGains] = useState({
    sine: 0.3,
    square: 0.3,
    sawtooth: 0.3
  });

  const toggleNote = useCallback((id: string) => {
    if (!audioEngine) return;

    const [note, waveform] = id.split('-');
    if (activeNotes.has(id)) {
      audioEngine.stopSound(id);
      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      audioEngine.playSound(id, waveGains[waveform as keyof typeof waveGains]);
      setActiveNotes((prev) => new Set(prev).add(id));
    }
  }, [audioEngine, activeNotes, waveGains]);

  const handleWaveGainChange = (waveform: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      setWaveGains(prev => ({
        ...prev,
        [waveform]: numValue
      }));
      
      // Update gains for any currently playing notes of this waveform
      activeNotes.forEach(noteId => {
        if (noteId.endsWith(waveform) && audioEngine) {
          audioEngine.setGain(noteId, numValue);
        }
      });
    }
  };

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
      
      <div className="flex flex-col gap-4">
        {WAVEFORMS.map((waveform) => (
          <div key={waveform} className="flex items-center gap-4">
            <span className="text-sm capitalize w-32">{waveform} Wave</span>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={waveGains[waveform as keyof typeof waveGains]}
              onChange={(e) => handleWaveGainChange(waveform, e.target.value)}
              className="w-20 h-8"
            />
          </div>
        ))}
      </div>
      
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