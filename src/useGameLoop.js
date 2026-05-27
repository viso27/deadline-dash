import { useEffect, useRef } from 'react';

export default function useGameLoop(callback, running) {
  const cbRef = useRef(callback);
  const rafRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => { cbRef.current = callback; }, [callback]);

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
      return;
    }

    const loop = (timestamp) => {
      if (lastRef.current === null) lastRef.current = timestamp;
      const delta = Math.min((timestamp - lastRef.current) / 1000, 0.05);
      lastRef.current = timestamp;
      cbRef.current(delta);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);
}
