import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const FlipWords = ({
  words = [],
  duration = 2300,
  className = "",
}) => {
  const safeWords = useMemo(
    () => (Array.isArray(words) ? words.filter(Boolean) : []),
    [words]
  );
  const wordsSignature = useMemo(() => safeWords.join("\u0000"), [safeWords]);

  useEffect(() => {
    // If the words array changes, ensure index remains in-bounds and start from 0.
    setIndex(0);
  }, [wordsSignature]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeWords.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeWords.length);
    }, duration);
    return () => clearInterval(id);
  }, [duration, safeWords.length, wordsSignature]);
    
  const currentWord = safeWords[index] ?? safeWords[0] ?? "";

  return (
    <span
        className={`flip-words-container ${className}`}
        style={{ display: "inline-block", position: "relative" }}
      >
      <AnimatePresence mode="wait" initial={false}>
          <motion.span
          key={`${index}-${currentWord}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, position: "absolute" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
          {currentWord}
          </motion.span>
    </AnimatePresence>
    </span>
  );
};
