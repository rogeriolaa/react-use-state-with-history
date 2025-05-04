import { useState, useCallback, useRef } from "react";

type SetStateAction<T> = T | ((prevState: T) => T);
type UseStateHistoryReturn<T> = [
  T,
  (value: SetStateAction<T>) => void,
  {
    history: T[];
    pointer: number;
    back: () => void;
    forward: () => void;
    go: (index: number) => void;
    first: () => void;
    last: () => void;
  }
];

function useStateWithHistory<T>(initialValue: T): UseStateHistoryReturn<T> {
  // Use refs for history and pointer to avoid re-renders
  const historyRef = useRef<T[]>([initialValue]);
  const pointerRef = useRef<number>(0);
  const [state, setState] = useState<T>(initialValue);

  // Force a re-render to update the returned object
  const [, forceUpdate] = useState({});

  const set = useCallback(
    (value: SetStateAction<T>) => {
      // Calculate the new value using the current state from historyRef
      // This ensures we're using the most up-to-date state for function updates
      const currentState = historyRef.current[pointerRef.current];
      const newValue = typeof value === "function"
        ? (value as (prevState: T) => T)(currentState)
        : value;

      // If pointer is not at the end, truncate future history
      if (pointerRef.current < historyRef.current.length - 1) {
        historyRef.current = historyRef.current.slice(0, pointerRef.current + 1);
      }

      // Add new value to history
      historyRef.current.push(newValue);
      pointerRef.current = historyRef.current.length - 1;
      
      // Update state
      setState(newValue);
      forceUpdate({});
    },
    []
  );

  const back = useCallback(() => {
    if (pointerRef.current <= 0) return;
    
    pointerRef.current--;
    setState(historyRef.current[pointerRef.current]);
    forceUpdate({});
  }, []);

  const forward = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return;
    
    pointerRef.current++;
    setState(historyRef.current[pointerRef.current]);
    forceUpdate({});
  }, []);

  const go = useCallback((index: number) => {
    if (index < 0 || index >= historyRef.current.length) return;
    
    pointerRef.current = index;
    setState(historyRef.current[pointerRef.current]);
    forceUpdate({});
  }, []);

  const first = useCallback(() => {
    if (pointerRef.current === 0) return;
    
    pointerRef.current = 0;
    setState(historyRef.current[0]);
    forceUpdate({});
  }, []);

  const last = useCallback(() => {
    const lastIndex = historyRef.current.length - 1;
    if (pointerRef.current === lastIndex) return;
    
    pointerRef.current = lastIndex;
    setState(historyRef.current[lastIndex]);
    forceUpdate({});
  }, []);

  return [
    state,
    set,
    {
      history: historyRef.current,
      pointer: pointerRef.current,
      back,
      forward,
      go,
      first,
      last,
    },
  ];
}

export default useStateWithHistory;
