import React, { useEffect, useState, useRef } from "react";

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const offset = Math.random() * 100;
  switch (side) {
    case 0: return { x: offset, y: 0, angle: 45 };
    case 1: return { x: 0, y: offset, angle: 45 };
    case 2: return { x: 100, y: offset, angle: 135 };
    case 3: return { x: offset, y: 100, angle: 225 };
    default: return { x: 50, y: 0, angle: 45 };
  }
};

export const ShootingStars = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  className = "",
}) => {
  const [star, setStar] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar = {
        id: Date.now(),
        x: x + "%",
        y: y + "%",
        angle,
        scale: 1,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      };
      setStar(newStar);
      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(createStar, randomDelay);
    };

    const timeout = setTimeout(createStar, minDelay);
    return () => clearTimeout(timeout);
  }, [minDelay, maxDelay, minSpeed, maxSpeed]);

  useEffect(() => {
    const moveStar = () => {
      if (star) {
        setStar((prevStar) => {
          if (!prevStar) return null;
          const newDistance = prevStar.distance + prevStar.speed;
          // Rough check to see if it's off screen
          if (newDistance > 2000) { // arbitrary large number for off-screen
            return null;
          }
          return {
            ...prevStar,
            distance: newDistance,
          };
        });
      }
    };
    const animationFrame = requestAnimationFrame(moveStar);
    return () => cancelAnimationFrame(animationFrame);
  }, [star]);

  if (!star) return null;

  return (
    <svg
      ref={svgRef}
      className={`shooting-stars-svg ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <rect
        key={star.id}
        x={star.distance}
        y={0}
        width={starWidth}
        height={starHeight}
        fill="url(#gradient)"
        transform={`translate(${parseFloat(star.x)}, ${parseFloat(star.y)}) rotate(${star.angle})`}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
};

