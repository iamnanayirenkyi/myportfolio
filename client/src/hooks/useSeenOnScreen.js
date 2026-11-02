import { useEffect, useRef, useState } from 'react';

/* Tells us once an element has scrolled into view, so it can animate in */
export function useSeenOnScreen(threshold = 0.18) {
  const spotRef = useRef(null);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return undefined;
    if (!('IntersectionObserver' in window)) {
      setHasBeenSeen(true);
      return undefined;
    }
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenSeen(true);
          watcher.disconnect();
        }
      },
      { threshold }
    );
    watcher.observe(spot);
    return () => watcher.disconnect();
  }, [threshold]);

  return [spotRef, hasBeenSeen];
}
