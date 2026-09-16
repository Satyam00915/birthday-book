// PageContent.jsx — photo + caption layout with staggered entrance
// Used by both the flipping page (front face) and the underlay (behind it).
// Parallax is disabled on underlay pages to avoid jitter.

import { motion } from "framer-motion";
import { useParallax } from "../hooks/useParallax.js";

/* ─── Stagger container ─────────────────────────────────────────────────────── */
const pageEnterContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const photoEnter = {
  hidden: { opacity: 0, scale: 0.96, y: 18, filter: "blur(4px)" },
  show: {
    opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const captionEnter = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const yearEnter = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 0.7, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/* ─────────────────────────────────────────────────────────────────────────────── */
export default function PageContent({ data, isUnderlay = false, isFlipping = false }) {
  // Parallax disabled on underlay or while flipping to prevent z-fighting / jitter
  const parallaxStrength = isUnderlay || isFlipping ? 0 : 12;
  const { x: px, y: py } = useParallax(parallaxStrength);

  if (!data) return null;

  const {
    imageSrc, placeholderLabel, quote, caption,
    rotation, captionSide, year, isFinal,
  } = data;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "linear-gradient(158deg, #2f2319 0%, #241a0f 55%, #1c1309 100%)",
        overflow: "hidden",
        // GPU layer hint
        willChange: "transform",
        WebkitTransform: "translateZ(0)",
      }}
    >
      <JournalLines />

      {isFinal ? (
        <FinalPageContent data={data} isUnderlay={isUnderlay} />
      ) : (
        <SpreadLayout
          imageSrc={imageSrc}
          placeholderLabel={placeholderLabel}
          quote={quote}
          caption={caption}
          rotation={rotation}
          captionSide={captionSide}
          year={year}
          parallaxX={px}
          parallaxY={py}
          // Skip entrance animation on underlay (it's just background)
          animate={!isUnderlay}
        />
      )}
    </div>
  );
}

/* ─── SPREAD LAYOUT ─────────────────────────────────────────────────────────── */
function SpreadLayout({
  imageSrc, placeholderLabel, quote, caption,
  rotation, captionSide, year,
  parallaxX, parallaxY,
  animate: doAnimate,
}) {
  const isRight = captionSide === "right";

  return (
    <motion.div
      variants={doAnimate ? pageEnterContainer : undefined}
      initial={doAnimate ? "hidden" : false}
      animate={doAnimate ? "show" : false}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {/* ── Photo ── */}
      <motion.div
        variants={doAnimate ? photoEnter : undefined}
        style={{
          x: parallaxX,
          y: parallaxY,
          position: "absolute",
          width: "clamp(155px, 50%, 340px)",
          aspectRatio: "3/4",
          [isRight ? "left" : "right"]: "clamp(1rem, 7%, 4.5rem)",
          top: "50%",
          // Inline rotate so that the Framer x/y don't fight with a CSS transform
          // We use a wrapper div for the tilt so motion only controls x/y
          translateY: "-50%",
          willChange: "transform",
        }}
      >
        {/* Tilt wrapper — no MotionValue, just CSS */}
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `rotate(${rotation ?? 0}deg)`,
            boxShadow: "0 18px 48px rgba(0,0,0,0.68), 0 4px 12px rgba(0,0,0,0.38)",
            borderRadius: "2px",
            overflow: "hidden",
            background: "#1a1208",
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "sepia(0.14) contrast(1.04) brightness(0.95)",
                pointerEvents: "none",
              }}
            />
          ) : (
            <PlaceholderPhoto label={placeholderLabel} />
          )}

          {/* Photo vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </motion.div>

      {/* ── Caption block ── */}
      <motion.div
        variants={doAnimate ? captionEnter : undefined}
        style={{
          position: "absolute",
          [isRight ? "right" : "left"]: "clamp(1.2rem, 5%, 3rem)",
          bottom: "clamp(1.6rem, 7%, 3.6rem)",
          maxWidth: "clamp(180px, 44%, 380px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.7rem, 1.8vw, 1.1rem)",
          textAlign: isRight ? "right" : "left",
        }}
      >
        {/* Year stamp */}
        <motion.span
          variants={doAnimate ? yearEnter : undefined}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.72rem, 1.8vw, 0.95rem)",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: "var(--col-amber)",
          }}
        >
          {year}
        </motion.span>

        {/* Quote */}
        <blockquote
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(1.15rem, 3.2vw, 1.85rem)",
            lineHeight: 1.28,
            color: "var(--col-text)",
            margin: 0,
            opacity: 0.96,
          }}
        >
          {quote}
        </blockquote>

        {/* Thin amber rule */}
        <div
          style={{
            width: "clamp(32px, 6vw, 52px)",
            height: "1.5px",
            background: "var(--col-amber-dim)",
            alignSelf: isRight ? "flex-end" : "flex-start",
            opacity: 0.6,
          }}
        />

        {/* Caption body */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.82rem, 1.8vw, 1.06rem)",
            lineHeight: 1.72,
            color: "var(--col-text)",
            opacity: 0.88,
            margin: 0,
          }}
        >
          {caption}
        </p>
      </motion.div>

      {/* Page number */}
      <span
        style={{
          position: "absolute",
          top: "1.2rem",
          right: "1.4rem",
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.6rem, 1.4vw, 0.72rem)",
          letterSpacing: "0.18em",
          color: "var(--col-text-muted)",
          opacity: 0.55,
          userSelect: "none",
        }}
      >
        — {String(placeholderLabel?.match(/\d+/)?.[0] ?? "").padStart(2, "0")} —
      </span>
    </motion.div>
  );
}

/* ─── FINAL PAGE ──────────────────────────────────────────────────────────── */
function FinalPageContent({ data, isUnderlay }) {
  const lines = data.caption.split("\n\n");

  return (
    <motion.div
      initial={isUnderlay ? false : { opacity: 0 }}
      animate={isUnderlay ? {} : { opacity: 1 }}
      transition={{ delay: 0.5, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.4rem",
        padding: "clamp(1rem, 4%, 2.5rem)",
        textAlign: "center",
      }}
    >
      <svg width="48" height="2" viewBox="0 0 48 2" aria-hidden="true">
        <line x1="0" y1="1" x2="48" y2="1" stroke="var(--col-amber-dim)" strokeWidth="1" />
      </svg>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.72rem, 1.8vw, 0.92rem)",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "var(--col-amber)",
          opacity: 0.85,
        }}
      >
        {data.year} — Personal Archive
      </p>

      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={isUnderlay ? false : { opacity: 0, y: 10 }}
          animate={isUnderlay ? {} : { opacity: 1, y: 0 }}
          transition={{
            delay: 0.65 + i * 0.28,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            fontFamily: i === lines.length - 1 ? "var(--font-display)" : "var(--font-body)",
            fontStyle: i === lines.length - 1 ? "italic" : "normal",
            fontWeight: i === lines.length - 1 ? 700 : 300,
            fontSize:
              i === lines.length - 1
                ? "clamp(1.35rem, 4.2vw, 2.2rem)"
                : "clamp(0.85rem, 1.8vw, 1.08rem)",
            lineHeight: i === lines.length - 1 ? 1.25 : 1.78,
            color: i === lines.length - 1 ? "var(--col-text)" : "var(--col-text)",
            opacity: i === lines.length - 1 ? 1 : 0.85,
            margin: 0,
            maxWidth: "40ch",
          }}
        >
          {line}
        </motion.p>
      ))}

      <svg width="48" height="2" viewBox="0 0 48 2" aria-hidden="true">
        <line x1="0" y1="1" x2="48" y2="1" stroke="var(--col-amber-dim)" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}

/* ─── PLACEHOLDER PHOTO ─────────────────────────────────────────────────────── */
function PlaceholderPhoto({ label }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(160deg, #2e2218 0%, #1a1208 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.8rem",
        border: "1px dashed rgba(201,129,58,0.18)",
      }}
    >
      <svg
        width="30" height="30" viewBox="0 0 24 24"
        fill="none" stroke="rgba(201,129,58,0.35)"
        strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.52rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(201,129,58,0.32)",
          textAlign: "center",
          padding: "0 1rem",
        }}
      >
        {label}<br />
        <span style={{ opacity: 0.6 }}>Drop image here</span>
      </span>
    </div>
  );
}

/* ─── JOURNAL LINES ─────────────────────────────────────────────────────────── */
function JournalLines() {
  return (
    <svg
      width="100%" height="100%"
      style={{ position: "absolute", inset: 0, opacity: 0.042, pointerEvents: "none" }}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <line
          key={i}
          x1="0" y1={26 + i * 21} x2="100%" y2={26 + i * 21}
          stroke="#d4c5a9" strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}
