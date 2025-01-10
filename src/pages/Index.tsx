import { useState, useCallback } from "react";
import { SoundGrid } from "@/components/sound/SoundGrid";
import { Sequencer } from "@/components/Sequencer";
import { SequencerGrid } from "@/components/SequencerGrid";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useSequencer } from "@/hooks/useSequencer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const audioEngine = useAudioEngine();
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [waveGains, setWaveGains] = useState({
    sine: 0.3,
    square: 0.3,
    sawtooth: 0.3
  });

  const {
    isPlaying,
    tempo,
    step,
    setTempo,
    handlePlayPause,
    handleReset
  } = useSequencer();

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
      
      activeNotes.forEach(noteId => {
        if (noteId.endsWith(waveform) && audioEngine) {
          audioEngine.setGain(noteId, numValue);
        }
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl min-h-screen p-8 flex flex-col gap-8">
      <Header />
      
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
        waveGains={waveGains}
        onWaveGainChange={handleWaveGainChange}
      />

      <SequencerGrid
        audioEngine={audioEngine}
        isPlaying={isPlaying}
        currentStep={step}
      />

      <Footer />
    </div>
  );
};

export default Index;