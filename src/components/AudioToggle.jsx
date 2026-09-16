// AudioToggle.jsx — ambient audio controller (v2 — mobile-first)
//
// Changes vs v1:
//  • Moved from top-right → bottom-left (comfortable left-thumb reach on phones)
//  • Touch target expanded to 48×48px minimum
//  • whileTap spring-back feedback
//  • Idle breathing animation on the icon when audio is OFF (invites interaction)
//  • Playing state: amber + spinning reel + soft glow aura
//  • WebkitTapHighlightColor cleared

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function AudioToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        audio.volume = 0.25;
        await audio.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked — silently fail
      }
    }
  };

  return (
    <>
      {/* Drop /public/audio/ambient.mp3 to activate */}
      <audio ref={audioRef} src="/audio/ambient.mp3" loop preload="none" aria-hidden="true" />

      <motion.button
        onClick={toggle}
        title={playing ? "Mute ambient audio" : "Play ambient audio"}
        aria-label={playing ? "Mute ambient audio" : "Play ambient audio"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        whileTap={{ scale: 0.88, transition: { duration: 0.08, type: "spring" } }}
        style={{
          position: "fixed",
          // Bottom-left: comfortable left-thumb zone on phones held in portrait
          bottom: "1.5rem",
          left: "1.4rem",
          zIndex: 1000,
          background: "none",
          border: "none",
          cursor: "pointer",
          // 48×48 minimum tap target
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          WebkitTapHighlightColor: "transparent",
          outline: "none",
          color: playing ? "var(--col-amber)" : "var(--col-text-muted)",
        }}
      >
        {/* Soft glow aura when playing */}
        {playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.3, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 4,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(201,129,58,0.3) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        )}

        <ReelIcon spinning={playing} idle={!playing} />
      </motion.button>
    </>
  );
}

function ReelIcon({ spinning, idle }) {
  return (
    <motion.svg
      width="22" height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      // Spinning when playing, gentle idle breathe when not
      animate={
        spinning
          ? { rotate: 360 }
          : idle
          ? { scale: [1, 1.08, 1] }
          : { rotate: 0, scale: 1 }
      }
      transition={
        spinning
          ? { repeat: Infinity, duration: 2.8, ease: "linear" }
          : idle
          ? { repeat: Infinity, duration: 3.6, ease: "easeInOut" }
          : { duration: 0.3 }
      }
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="5"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="5"  cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </motion.svg>
  );
}
