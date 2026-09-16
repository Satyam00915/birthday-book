// AmbientBackground.jsx — slow-drifting atmospheric light blobs with breathing
// Pure CSS animation — GPU-accelerated via transform + opacity, no JS

import styles from "./AmbientBackground.module.css";

export default function AmbientBackground() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />
      {/* Breathing pulse orb — very subtle center warmth that pulses on a slow cycle */}
      <div className={styles.pulse} />
    </div>
  );
}
