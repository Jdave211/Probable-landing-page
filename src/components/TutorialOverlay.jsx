import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TutorialOverlay.css';

export default function TutorialOverlay({ isOpen, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const steps = [
    {
      targetId: 'nav-chat',
      title: 'Chat with the Future',
      text: 'Come here to ask questions and get instant insights from prediction markets.',
      position: 'bottom'
    },
    {
      targetId: 'nav-dashboard',
      title: 'Advanced Analysis',
      text: 'Deep dive into market trends, probability shifts, and consensus data.',
      position: 'bottom'
    },
    {
      targetId: 'nav-how-it-works',
      title: 'How it Works',
      text: 'Learn about the methodology behind our prediction engine.',
      position: 'bottom'
    }
  ];

  useEffect(() => {
    if (!isOpen) return;
    
    const updatePosition = () => {
      const step = steps[stepIndex];
      const element = document.getElementById(step.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Ensure element is visible
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Initial update
    updatePosition();

    // Listen for resize
    window.addEventListener('resize', updatePosition);
    
    // Small delay to allow DOM to settle if coming from another view
    const timeout = setTimeout(updatePosition, 100);

    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timeout);
    };
  }, [isOpen, stepIndex]);

  if (!isOpen) return null;

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStepIndex(prev => prev + 1);
    }
  };

  return (
    <div className="tutorial-overlay">
      {/* Spotlight Effect using CSS clip-path or masks is complex, so we use a dimmed background 
          and z-index manipulation or just a visual overlay. 
          Here we'll use a composed SVG mask or just 4 divs to frame the target.
          Let's try a simpler approach: A full screen SVG with a hole.
      */}
      {targetRect && (
        <svg className="tutorial-mask" width="100%" height="100%">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect 
                x={targetRect.left - 5} 
                y={targetRect.top - 5} 
                width={targetRect.width + 10} 
                height={targetRect.height + 10} 
                fill="black" 
                rx="4"
              />
            </mask>
          </defs>
          <rect 
            x="0" 
            y="0" 
            width="100%" 
            height="100%" 
            fill="rgba(0, 0, 0, 0.7)" 
            mask="url(#spotlight-mask)" 
          />
          {/* Optional: Highlight border */}
          <rect 
            x={targetRect.left - 5} 
            y={targetRect.top - 5} 
            width={targetRect.width + 10} 
            height={targetRect.height + 10} 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="2"
            rx="4"
            className="tutorial-highlight-border"
          />
        </svg>
      )}

      <AnimatePresence mode="wait">
        {targetRect && (
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="tutorial-bubble"
            style={{
              top: targetRect.bottom + 20,
              left: targetRect.left + targetRect.width / 2,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="tutorial-bubble-arrow" />
            <div className="tutorial-content">
              <h3>{currentStep.title}</h3>
              <p>{currentStep.text}</p>
            </div>
            <div className="tutorial-actions">
              <button className="tutorial-skip" onClick={onComplete}>
                Skip
              </button>
              <div className="tutorial-progress">
                {stepIndex + 1} / {steps.length}
              </div>
              <button className="tutorial-next" onClick={handleNext}>
                {isLastStep ? 'Finish' : 'Next'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

