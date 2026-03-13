import { useState, useRef, useCallback } from 'react';

/**
 * useViewTransition
 * -----------------
 * Unified source of animation behaviour for view-level transitions.
 *
 * phase:
 *   'entering' — new content is sliding/fading in
 *   'idle'     — fully visible, no animation playing
 *   'exiting'  — current content is fading out (state change is blocked)
 *
 * Usage in App.js:
 *   const { phase, wrap, enter } = useViewTransition();
 *
 *   // Programmatic navigation (has outro + intro):
 *   const navigate = (view, filter) => wrap(() => {
 *     setView(view); setFilter(filter);
 *     window.history.pushState(...);
 *   });
 *
 *   // Browser back/forward (has intro only — outro already happened in browser):
 *   window.addEventListener('popstate', () => { doStateChange(); enter(); });
 *
 *   // View wrapper:
 *   <main className={`view-wrap view-wrap--${phase}`}>…</main>
 */

const OUTRO_MS        = 230;   // exit animation duration (matches viewExit CSS)
const INTRO_CLEAR_MS  = 440;   // when to reset phase → 'idle' (≥ entry animation duration)

const useViewTransition = () => {
  // Start in 'entering' so the very first page load gets an entrance animation.
  const [phase, setPhase] = useState('entering');
  const busy = useRef(false);

  /**
   * wrap(fn)
   * Plays the outro animation, then executes fn() (the actual state change),
   * then triggers the intro animation on whatever content renders next.
   */
  const wrap = useCallback((fn) => {
    // If a transition is already in progress, skip the outro and execute immediately.
    if (busy.current) {
      fn();
      return;
    }

    busy.current = true;
    setPhase('exiting');

    setTimeout(() => {
      // Execute the actual navigation / state change.
      fn();

      // Double-rAF: ensure the browser has painted the new content in its
      // initial (potentially zero-width / zero-opacity) state before we
      // trigger the enter animation, preventing a flash of the final state.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setPhase('entering');
          setTimeout(() => {
            setPhase('idle');
            busy.current = false;
          }, INTRO_CLEAR_MS);
        })
      );
    }, OUTRO_MS);
  }, []);

  /**
   * enter()
   * Triggers just the intro animation without an preceding outro.
   * Use this after external navigations (browser back/forward via popstate)
   * where the state has already changed outside our control.
   */
  const enter = useCallback(() => {
    setPhase('entering');
    setTimeout(() => setPhase('idle'), INTRO_CLEAR_MS);
  }, []);

  return { phase, wrap, enter };
};

export default useViewTransition;
