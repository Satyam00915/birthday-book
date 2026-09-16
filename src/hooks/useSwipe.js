// useSwipe.js — touch-swipe with scroll-direction locking
//
// Key mobile fix: adds a non-passive `touchmove` listener that calls
// `preventDefault()` once the gesture is confirmed horizontal.
// This stops the browser's native scroll from fighting the page-turn swipe.
//
// The hook also exposes `isSwiping` ref so parent components can pause
// other interactions (parallax, etc.) during an active swipe.

import { useRef, useEffect, useCallback } from "react";

/**
 * @param {{ onSwipeLeft, onSwipeRight, threshold?, velocityThreshold? }} opts
 * @returns { ref, isSwiping }
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 44,          // minimum px distance to register as swipe
  velocityThreshold = 0.3, // px/ms — fast flick counts even below distance threshold
}) {
  const ref       = useRef(null);
  const startX    = useRef(null);
  const startY    = useRef(null);
  const startTime = useRef(null);
  const locked    = useRef(null); // "horizontal" | "vertical" | null
  const isSwiping = useRef(false);

  // Stable callbacks — wrap in useCallback so effect deps don't thrash
  const handleLeft  = useCallback(() => onSwipeLeft?.(),  [onSwipeLeft]);
  const handleRight = useCallback(() => onSwipeRight?.(), [onSwipeRight]);

  useEffect(() => {
    const el = ref.current ?? window;

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      startX.current    = e.touches[0].clientX;
      startY.current    = e.touches[0].clientY;
      startTime.current = Date.now();
      locked.current    = null;
      isSwiping.current = false;
    };

    // Non-passive so we can call preventDefault on confirmed horizontal swipes
    const onTouchMove = (e) => {
      if (startX.current === null || e.touches.length !== 1) return;

      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);

      // Lock direction on first meaningful movement
      if (locked.current === null && (adx > 8 || ady > 8)) {
        locked.current = adx > ady ? "horizontal" : "vertical";
      }

      if (locked.current === "horizontal") {
        // Absorb the scroll event so page doesn't also scroll vertically
        e.preventDefault();
        isSwiping.current = true;
      }
    };

    const onTouchEnd = (e) => {
      if (startX.current === null) return;

      const dx       = e.changedTouches[0].clientX - startX.current;
      const elapsed  = Date.now() - startTime.current;
      const velocity = Math.abs(dx) / Math.max(elapsed, 1); // px/ms

      const isHorizontal = locked.current === "horizontal";
      const isFlick      = velocity > velocityThreshold;
      const isSwipe      = Math.abs(dx) > threshold;

      if (isHorizontal && (isSwipe || isFlick)) {
        if (dx < 0) handleLeft();
        else        handleRight();
      }

      // Reset
      startX.current    = null;
      startY.current    = null;
      startTime.current = null;
      locked.current    = null;
      isSwiping.current = false;
    };

    const onTouchCancel = () => {
      startX.current    = null;
      startY.current    = null;
      locked.current    = null;
      isSwiping.current = false;
    };

    el.addEventListener("touchstart",  onTouchStart,  { passive: true });
    el.addEventListener("touchmove",   onTouchMove,   { passive: false }); // must NOT be passive
    el.addEventListener("touchend",    onTouchEnd,    { passive: true });
    el.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      el.removeEventListener("touchstart",  onTouchStart);
      el.removeEventListener("touchmove",   onTouchMove);
      el.removeEventListener("touchend",    onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [handleLeft, handleRight, threshold, velocityThreshold]);

  return { ref, isSwiping };
}
