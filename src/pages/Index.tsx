import { useState, useCallback } from "react";
import { SoundGrid } from "@/components/sound/SoundGrid";
import { Sequencer } from "@/components/Sequencer";
import { SequencerGrid } from "@/components/SequencerGrid";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useSequencer } from "@/hooks/useSequencer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    <div className="mx-auto max-w-6xl min-h-screen p-8 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <Header />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
              <span className="sr-only">Information about the app</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to use Programmable Soundboard</DialogTitle>
              <DialogDescription className="text-left space-y-4 pt-4">
                <p>
                  Programmable Soundboard is an interactive web application that allows you to create musical loops using different waveforms.
                </p>
                <p>
                  1. Use the grid to toggle notes on/off for different waveforms (sine, square, sawtooth)
                </p>
                <p>
                  2. Adjust the volume for each waveform using the sliders
                </p>
                <p>
                  3. Control playback using the play/pause and reset buttons
                </p>
                <p>
                  4. Adjust the tempo to change the speed of your loop
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      
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