import { useState, useEffect } from "react";

export const useSequencer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [step, setStep] = useState(0);

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
  };

  return {
    isPlaying,
    tempo,
    step,
    setTempo,
    handlePlayPause,
    handleReset
  };
};