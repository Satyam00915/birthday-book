// ─────────────────────────────────────────────────────────────────────────────
// pages.js  —  Ruchiiiii content
// Swap imageSrc, quote, and caption with real content before publishing.
// rotation: subtle tilt on the photo (-3 to +3 deg works well)
// captionSide: "left" | "right"  — which corner the caption anchors to
// ─────────────────────────────────────────────────────────────────────────────

export const pages = [
  {
    id: 1,
    imageSrc: "/images/photo-1.jpg", // replace with: "/images/photo-1.jpg"
    placeholderLabel: "Photo 1",
    quote: "\"The beginning of everything.\"",
    caption:
      "Some places stay with you longer than you stayed in them. This was one of those places.",
    rotation: -2.5,
    captionSide: "right",
    year: "2019",
  },
  {
    id: 2,
    imageSrc: "/images/photo-2.jpg", // replace with: "/images/photo-2.jpg"
    placeholderLabel: "Photo 2",
    quote: "\"Somewhere between reckless and brave.\"",
    caption:
      "You said yes before anyone else did. That's always been your thing.",
    rotation: 1.8,
    captionSide: "left",
    year: "2020",
  },
  {
    id: 3,
    imageSrc: "/images/photo-3.jpg", // replace with: "/images/photo-3.jpg"
    placeholderLabel: "Photo 3",
    quote: "\"The ones who make you laugh the hardest.\"",
    caption:
      "Nothing staged here. This is just what it looks like when you're exactly where you're supposed to be.",
    rotation: -1.2,
    captionSide: "right",
    year: "2021",
  },
  {
    id: 4,
    imageSrc: "/images/photo-4.jpg", // replace with: "/images/photo-4.jpg"
    placeholderLabel: "Photo 4",
    quote: "\"Still becoming.\"",
    caption:
      "Every version of you so far has been better than the last. Watch what the next one does.",
    rotation: 2.1,
    captionSide: "left",
    year: "2024",
  },
  {
    id: 5,
    imageSrc: "/images/photo-5.jpg", // replace with: "/images/photo-5.jpg"
    placeholderLabel: "Photo 5 — Final",
    quote: "\"Here's to the next one.\"",
    caption:
      "Twenty-two trips around the sun. Every single one of them worth it.\n\nThis is the part where we stop counting and start living the next chapter.\n\nHappy birthday.",
    rotation: -0.8,
    captionSide: "right",
    year: "2026",
    isFinal: true,
  },
];
