import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const FlipWords = ({
  words,
  duration = 2300,
  className = ""
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);

  const startAnimation = useCallback(() => {
    setCurrentWord((prevWord) => {
      const currentIndex = words.indexOf(prevWord);
      const nextIndex = words[currentIndex + 1] ? currentIndex + 1 : 0;
      return words[nextIndex];
    });
  }, [words]);

  useEffect(() => {
    const interval = setInterval(() => {
      startAnimation();
    }, duration);
    
    return () => clearInterval(interval);
  }, [startAnimation, duration]);

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
