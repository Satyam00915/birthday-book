// useParallax.js — adaptive parallax: mouse on desktop, device-tilt on mobile
//
// Detection: `hover: none` media query = touch device (phone/tablet).
//
// Mobile strategy:
//   • Listen to `deviceorientation` (works on Android + iOS 12 and below natively)
//   • On iOS 13+, DeviceOrientationEvent.requestPermission() is required —
//     this hook requests it automatically the first time the hook is used,
//     which must happen after a user gesture (component mounting on tap works).
//   • If permission is denied or the API is unavailable, the hook returns
//     zeros silently (photos still have their entrance animations).

import { useRef, useEffect } from "react";
import { useSpring, useMotionValue } from "framer-motion";

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// Singleton permission state so we only ask once per session
let orientationPermissionGranted =
  typeof DeviceOrientationEvent === "undefined" ||
  typeof DeviceOrientationEvent.requestPermission !== "function"
    ? true   // Android / older iOS — no permission needed
    : null;  // iOS 13+ — unknown until we ask

async function requestOrientationPermission() {
  if (orientationPermissionGranted !== null) return orientationPermissionGranted;
  try {
    const result = await DeviceOrientationEvent.requestPermission();
    orientationPermissionGranted = result === "granted";
  } catch {
    orientationPermissionGranted = false;
  }
  return orientationPermissionGranted;
}

/**
 * Returns { x, y } MotionValues that shift based on:
 *   — mouse position on desktop (hover: hover)
 *   — device tilt  on mobile  (hover: none)
 *
 * @param {number} strength  — max pixel offset (desktop: 12, mobile: auto-halved)
 */
export function useParallax(strength = 12) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 65, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 65, damping: 22, mass: 0.6 });

  const active = useRef(true);

  useEffect(() => {
    if (strength === 0) return; // caller opted out (underlay / flipping)

    active.current = true;

    if (isTouchDevice()) {
      // ── Mobile: gyroscope tilt ─────────────────────────────────────────────
      const mobileStrength = strength * 0.6; // gentler on mobile

      const handleOrientation = (e) => {
        if (!active.current) return;
        // gamma = left/right tilt (−90° to +90°), clamp to ±25°
        // beta  = forward/back tilt (−180° to +180°), offset by ~45° (phone held upright)
        const gx = Math.max(-25, Math.min(25, e.gamma ?? 0));
        const gy = Math.max(-25, Math.min(25, (e.beta ?? 45) - 45));
        x.set((gx / 25) * mobileStrength);
        y.set((gy / 25) * mobileStrength);
      };

      requestOrientationPermission().then((granted) => {
        if (!granted || !active.current) return;
        window.addEventListener("deviceorientation", handleOrientation, { passive: true });
      });

      return () => {
        active.current = false;
        window.removeEventListener("deviceorientation", handleOrientation);
        // Smoothly return to zero
        x.set(0);
        y.set(0);
      };
    } else {
      // ── Desktop: mouse position ────────────────────────────────────────────
      const handleMouse = (e) => {
        if (!active.current) return;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        x.set(nx * strength);
        y.set(ny * strength);
      };

      window.addEventListener("mousemove", handleMouse, { passive: true });

      return () => {
        active.current = false;
        window.removeEventListener("mousemove", handleMouse);
      };
    }
  }, [strength, x, y]);

  return { x: springX, y: springY };
}
