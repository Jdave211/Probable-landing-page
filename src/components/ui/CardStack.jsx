"use client";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";

let interval;

export const CardStack = ({
  items,
  offset,
  scaleFactor
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState(items);

  useEffect(() => {
    // Keep in sync if items change.
    setCards(items);
  }, [items]);

  const flipOnce = useCallback(() => {
    setCards((prevCards) => {
      const newArray = [...prevCards]; // create a copy of the array
      newArray.unshift(newArray.pop()); // move the last element to the front
      return newArray;
    });
  }, []);

  const startFlipping = useCallback(() => {
    clearInterval(interval);
    interval = setInterval(() => {
      flipOnce();
    }, 10000);
  }, [flipOnce]);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, [startFlipping]);

  return (
    <div
      style={{
        position: "relative",
        height: "520px",
        width: "min(720px, 100%)",
        margin: "0 auto",
      }}
    >
      {cards.map((card, index) => {
        const imageSrc =
          typeof card?.image === "string"
            ? card.image
            : card?.image?.default || card?.image;

        return (
          <motion.div
            key={card.id}
            onClick={() => {
              flipOnce();
              startFlipping(); // reset timer after manual advance
            }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "520px",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
              background: "#0d1117",
              transformOrigin: "top center",
              cursor: "pointer",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}>
            <img 
              src={imageSrc} 
              alt={`Hedge example ${card.id}`}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

