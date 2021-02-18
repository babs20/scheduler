import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, isReplace = false) => {
    setMode(newMode);

    setHistory((prev) => {
      const buffer = [...prev];
      if (isReplace) buffer.pop();
      return [...buffer, mode];
    });
  };

  const back = () => {
    const buffer = [...history];
    if (buffer.length === 1) return setMode(buffer[0]);
    buffer.pop();
    const lastMode = buffer[buffer.length - 1];
    setMode(lastMode);
  };

  return {
    mode,
    transition,
    back,
  };
}
