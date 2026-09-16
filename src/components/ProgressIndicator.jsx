// ProgressIndicator.jsx — stamp/dash row (v2)
//
// New in v2:
//  • Active dash expansion uses a spring (stiffness:160, damping:14) — bouncy snap
//  • Fill bar inside springs from scaleX 0→1 with spring overshoot
//  • A brief amber glow "ring" pulses outward from the newly active dash (AnimatePresence)
//  • Bottom offset respects audio toggle (which moved to bottom-right)
//  • Larger hit area via padding (already invisible, but part of the touch zone in Book)

import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";

export default function ProgressIndicator({ total, current }) {
  return (
    <div
      role="tablist"
      aria-label={`Page ${current + 1} of ${total}`}
      style={{
        position: "fixed",
        bottom: "1.6rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "flex",
        gap: "0.6rem",
        alignItems: "center",
        padding: "0.5rem 0.75rem", // extra padding expands touch area slightly
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <StampDash key={i} active={i === current} index={i} pageNum={i + 1} />
      ))}
    </div>
  );
}

function StampDash({ active, index, pageNum }) {
  return (
    <motion.div
      role="tab"
      aria-label={`Page ${pageNum}`}
      aria-selected={active}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{
        delay: 0.08 * index,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      {/* Outer track — width springs with overshoot when active */}
      <motion.div
        animate={{ width: active ? "2rem" : "0.75rem" }}
        transition={{ type: "spring", stiffness: 160, damping: 14, mass: 0.8 }}
        style={{
          height: "2px",
          background: "var(--col-text-muted)",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Active fill — spring from left */}
        <AnimatePresence>
          {active && (
            <motion.div
              key="fill"
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 16,
                mass: 0.7,
              }}
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--col-amber)",
                transformOrigin: "left",
                borderRadius: "2px",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Activation glow ring — pulses once on becoming active */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={`glow-${index}`}
            initial={{ opacity: 0.9, scaleX: 1, scaleY: 1 }}
            animate={{ opacity: 0, scaleX: 5, scaleY: 8 }}
            exit={{}}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--col-amber-dim)",
              borderRadius: "2px",
              pointerEvents: "none",
              transformOrigin: "left",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
