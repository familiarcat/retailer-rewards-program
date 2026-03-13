import { useState, useEffect } from 'react';

/**
 * useAnimateIn
 * ------------
 * Returns `true` after the component has mounted and two animation frames
 * have elapsed — giving the browser time to paint the element in its initial
 * state (e.g. width: 0, opacity: 0) before CSS transitions kick in.
 *
 * Primary use-case: animating horizontal bars (pts-bar, amt-bar) that need
 * to start at zero width and transition to their real widths on first render.
 *
 * Example:
 *   const animated = useAnimateIn();
 *   <div style={{ width: animated ? `${pct}%` : '0%' }} className="pts-bar" />
 *
 * The existing `transition: width …` on the element handles the visual tween.
 */
const useAnimateIn = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let raf1, raf2;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setActive(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return active;
};

export default useAnimateIn;
