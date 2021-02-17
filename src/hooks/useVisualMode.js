import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, isReplace = false) => {
    if (isReplace) history.pop();

    setMode(newMode);
    history.push(newMode);
  };

  const back = () => {
    if (history.length === 1) return setMode(history[0]);
    history.pop();
    const lastMode = history[history.length - 1];
    setMode(lastMode);
  };

  return {
    mode,
    transition,
    back,
  };
}
