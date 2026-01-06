import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const FlipWords = ({
  words,
  duration = 2300,
  className = ""
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const wordsRef = useRef(words);

  // Update the ref when words change
  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % wordsRef.current.length;
        setCurrentWord(wordsRef.current[nextIndex]);
        return nextIndex;
      });
    }, duration);
    
    return () => clearInterval(interval);
  }, [duration, words.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        exit={{
          opacity: 0,
          y: -40,
          x: 40,
          filter: "blur(8px)",
          scale: 2,
          position: "absolute",
        }}
        className={`flip-words-container ${className}`}
        key={currentWord}
        style={{ display: "inline-block", position: "relative" }}
      >
        {currentWord.split("").map((letter, index) => (
          <motion.span
            key={currentWord + index}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
            }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
