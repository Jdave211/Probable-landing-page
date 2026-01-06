import React, { useState, useEffect, useRef } from "react";

export const StarsBackground = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  className = "",
}) => {
  const [stars, setStars] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const updateStars = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        const starCount = width * height * starDensity;
        
        const newStars = new Array(Math.floor(starCount)).fill(0).map(() => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.5 + 0.5,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * (maxTwinkleSpeed - minTwinkleSpeed) + minTwinkleSpeed,
        }));
        setStars(newStars);
      }
    };

    updateStars();
    window.addEventListener("resize", updateStars);
    return () => window.removeEventListener("resize", updateStars);
  }, [starDensity, maxTwinkleSpeed, minTwinkleSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        if (allStarsTwinkle && Math.random() < twinkleProbability) {
          star.opacity += star.twinkleSpeed * (Math.random() > 0.5 ? 0.01 : -0.01);
          if (star.opacity > 1) star.opacity = 1;
          if (star.opacity < 0.3) star.opacity = 0.3;
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [stars, allStarsTwinkle, twinkleProbability]);

  return (
    <canvas
      ref={canvasRef}
      className={`stars-background ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

