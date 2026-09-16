// App.jsx — Root state machine (v2)
// States: "landing" → "cover" → "book"
//
// Transition choreography:
//   landing → cover:  Landing shrinks+blurs OUT (0.65s), then Cover materialises IN (0.78s spring)
//   cover → book:     Cover shrinks OUT (0.5s), Book scales IN with slight y-rise (0.78s spring)
//   book → cover:     Book shrinks OUT, Cover reappears
//
// AnimatePresence mode="wait" guarantees the exit animation fully
// completes before the next scene mounts — no jarring overlap.

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Landing from "./components/Landing.jsx";
import BookCover from "./components/BookCover.jsx";
import Book from "./components/Book.jsx";
import GrainOverlay from "./components/GrainOverlay.jsx";
import AmbientBackground from "./components/AmbientBackground.jsx";
import AudioToggle from "./components/AudioToggle.jsx";

const SCENES = {
  LANDING: "landing",
  COVER:   "cover",
  BOOK:    "book",
};

export default function App() {
  const [scene, setScene] = useState(SCENES.LANDING);

  // Each handler is a clean setter — scene transitions are synchronous
  const openCover = () => setScene(SCENES.COVER);
  const openBook  = () => setScene(SCENES.BOOK);
  const closeBook = () => setScene(SCENES.COVER);

  return (
    <>
      {/* Always-present atmosphere layers (z-index: 0 and 9999) */}
      <AmbientBackground />
      <GrainOverlay />
      <AudioToggle />

      {/* Scene router — mode="wait" ensures clean sequential transitions */}
      <AnimatePresence mode="wait">
        {scene === SCENES.LANDING && (
          <Landing key="landing" onOpen={openCover} />
        )}

        {scene === SCENES.COVER && (
          <BookCover key="cover" onOpen={openBook} />
        )}

        {scene === SCENES.BOOK && (
          <Book key="book" onClose={closeBook} />
        )}
      </AnimatePresence>
    </>
  );
}
