// BookCover.jsx — worn journal cover object (v3)
//
// Reliable tactile interaction:
//  • Idle float: gentle floating bobbing loop (y: 0 -> -8 -> 0)
//  • On tap/click: instant whileTap scale response + anticipation shake wiggle
//  • Reliable hand-off to onOpen() without hanging async animation promises
//  • Full touch target + keyboard accessibility

import { useState } from "react";
import { motion } from "framer-motion";

export default function BookCover({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Give a brief beat for the anticipation shake animation (380ms) then open
    setTimeout(() => {
      onOpen();
    }, 380);
  };

  return (
    <motion.div
      key="cover"
      initial={{ opacity: 0, scale: 0.86, y: 36, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        scale: 0.92,
        y: 14,
        filter: "blur(4px)",
        transition: { duration: 0.44, ease: [0.4, 0, 1, 1] },
      }}
      transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated cover object */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Open Ruchiiiii"
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
        }}
        whileTap={{ scale: 0.96 }}
        animate={
          isOpening
            ? {
                scale: [1, 0.95, 1.04],
                rotateZ: [0, -2.5, 2.5, -1.5, 1.5, 0],
                y: 0,
              }
            : {
                y: [0, -8, 0],
                rotateZ: 0,
              }
        }
        transition={
          isOpening
            ? { duration: 0.38, ease: "easeInOut" }
            : {
                y: {
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                },
              }
        }
        style={{
          width: "clamp(240px, 52vw, 420px)",
          height: "clamp(320px, 64vh, 560px)",
          background:
            "linear-gradient(160deg, #2e2218 0%, #1e1610 40%, #16100c 100%)",
          borderRadius: "4px 12px 12px 4px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.62), -6px 0 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          willChange: "transform",
        }}
      >
        {/* Spine accent */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 18,
          background: "linear-gradient(180deg, #3a2c1a 0%, #241a0f 50%, #1a1208 100%)",
          borderRight: "1px solid rgba(201,129,58,0.12)",
          boxShadow: "inset -2px 0 6px rgba(0,0,0,0.4)",
        }} />

        {/* Texture lines */}
        <JournalTexture />

        {/* Embossed title */}
        <div style={{
          position: "absolute",
          top: "38%", left: "50%",
          transform: "translate(-46%, -50%)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.7rem",
        }}>
          <div style={{ width: 60, height: 1, background: "var(--col-amber-dim)", opacity: 0.6 }} />
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1rem, 3.5vw, 1.6rem)",
            color: "var(--col-text)",
            letterSpacing: "0.04em",
            opacity: 0.85,
            lineHeight: 1.3,
          }}>
            Memory<br />Book
          </h2>
          <div style={{ width: 60, height: 1, background: "var(--col-amber-dim)", opacity: 0.6 }} />
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.55rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--col-amber-dim)",
            opacity: 0.8,
            marginTop: "0.2rem",
          }}>
            Vol. XXII
          </p>
        </div>

        {/* "Open me" prompt — slow amber pulse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          style={{
            position: "absolute",
            bottom: "1.8rem",
            left: "50%",
            transform: "translateX(-46%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <motion.span
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.55rem, 1.8vw, 0.62rem)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--col-amber)",
            }}
          >
            Open me
          </motion.span>

          {/* Pulsing chevron */}
          <motion.svg
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true"
          >
            <path d="M1 1L8 7L15 1" stroke="var(--col-amber)"
              strokeWidth="1" strokeLinecap="round" strokeOpacity="0.65" />
          </motion.svg>
        </motion.div>

        {/* Corner dog-ear */}
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: 28, height: 28,
          background: "linear-gradient(135deg, transparent 50%, rgba(201,129,58,0.12) 50%)",
          borderTop: "1px solid rgba(201,129,58,0.1)",
          borderLeft: "1px solid rgba(201,129,58,0.1)",
        }} />
      </motion.div>
    </motion.div>
  );
}

function JournalTexture() {
  return (
    <svg width="100%" height="100%"
      style={{ position: "absolute", inset: 0, opacity: 0.06 }}
      aria-hidden="true" preserveAspectRatio="none">
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={i} x1="24" y1={40 + i * 26} x2="100%" y2={40 + i * 26}
          stroke="rgba(212,197,169,0.8)" strokeWidth="0.5" />
      ))}
    </svg>
  );
}
