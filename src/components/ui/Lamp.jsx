import React from "react";
import { motion } from "framer-motion";

export const LampContainer = ({ children, className = "" }) => {
  return (
    <div
      className={`lamp-container-wrapper ${className}`}
      style={{
        position: "relative",
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // Changed from center to flex-start
        overflow: "hidden",
        backgroundColor: "transparent",
        width: "100%",
        borderRadius: "0.375rem",
        zIndex: 0,
      }}
    >
      <div
        className="lamp-effect-container"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          display: "flex",
          width: "100%",
          transform: "scaleY(1.25)",
          alignItems: "center",
          justifyContent: "center",
          isolation: "isolate",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(from 70deg at center top, var(--lamp-color, #0b4f6c), transparent, transparent)`, // Darker cyan
            position: "absolute",
            inset: "auto",
            right: "50%",
            height: "14rem",
            width: "30rem", // Fallback
            overflow: "visible",
            // bg-gradient-conic logic
          }}
          className="lamp-left-beam"
        >
          {/* Masks */}
          <div style={{
            position: "absolute",
            width: "100%",
            left: 0,
            backgroundColor: "#0d1117",
            height: "10rem",
            bottom: 0,
            zIndex: 20,
            maskImage: "linear-gradient(to top, white, transparent)"
          }} />
          <div style={{
            position: "absolute",
            width: "10rem",
            height: "100%",
            left: 0,
            backgroundColor: "#0d1117",
            bottom: 0,
            zIndex: 20,
            maskImage: "linear-gradient(to right, white, transparent)"
          }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, var(--lamp-color, #0b4f6c))`, // Darker cyan
            position: "absolute",
            inset: "auto",
            left: "50%",
            height: "14rem",
            width: "30rem", // Fallback
          }}
          className="lamp-right-beam"
        >
          {/* Masks */}
          <div style={{
            position: "absolute",
            width: "10rem",
            height: "100%",
            right: 0,
            backgroundColor: "#0d1117",
            bottom: 0,
            zIndex: 20,
            maskImage: "linear-gradient(to left, white, transparent)"
          }} />
          <div style={{
            position: "absolute",
            width: "100%",
            right: 0,
            backgroundColor: "#0d1117",
            height: "10rem",
            bottom: 0,
            zIndex: 20,
            maskImage: "linear-gradient(to top, white, transparent)"
          }} />
        </motion.div>

        {/* Glows */}
        <div style={{
          position: "absolute",
          top: "50%",
          height: "12rem",
          width: "100%",
          transform: "translateY(3rem) scaleX(1.5)",
          backgroundColor: "#0d1117",
          filter: "blur(24px)",
          zIndex: 10 // Ensure glows are behind text container
        }}></div>
        <div style={{
          position: "absolute",
          top: "50%",
          zIndex: 10,
          height: "12rem",
          width: "100%",
          backgroundColor: "transparent",
          opacity: 0.1,
          backdropFilter: "blur(12px)"
        }}></div>
        <div style={{
          position: "absolute",
          inset: "auto",
          zIndex: 10,
          height: "9rem",
          width: "28rem",
          transform: "translateY(-50%)",
          borderRadius: "9999px",
          backgroundColor: "var(--lamp-color, #0b4f6c)", // Darker cyan
          opacity: 0.5,
          filter: "blur(48px)"
        }}></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            inset: "auto",
            zIndex: 30,
            height: "9rem",
            width: "16rem",
            transform: "translateY(-6rem)",
            borderRadius: "9999px",
            backgroundColor: "var(--lamp-color, #0b4f6c)", // Darker cyan
            filter: "blur(24px)"
          }}
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            inset: "auto",
            zIndex: 10, // Lower z-index to avoid overlaying text
            height: "2px",
            width: "30rem",
            transform: "translateY(-7rem)",
            backgroundColor: "var(--lamp-color, #0b4f6c)" // Darker cyan
          }}
        ></motion.div>

        <div style={{
          position: "absolute",
          inset: "auto",
          zIndex: 40,
          height: "11rem",
          width: "100%",
          transform: "translateY(-12.5rem)",
          backgroundColor: "#0d1117"
        }}></div>
      </div>

      <div 
        className="lamp-content-container"
        style={{
          position: "relative",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
          // paddingTop removed - now controlled by CSS for responsive behavior
          width: "100%",
          minHeight: "100vh",
          justifyContent: "center",
      }}>
        {children}
      </div>
    </div>
  );
};

