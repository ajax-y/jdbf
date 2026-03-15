"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { Sparkle } from "lucide-react";

export function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isClicking, setIsClicking] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const springConfig = { damping: 20, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const dotSpringConfig = { damping: 40, stiffness: 600 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Add a sparkly particle
      if (Math.random() > 0.2) { // More frequent sparkles for a long tail
        const id = Math.random();
        const size = Math.random() * 10 + 2;
        // Subtle random offset for a vapor-like trail
        const x = e.clientX + (Math.random() - 0.5) * 10;
        const y = e.clientY + (Math.random() - 0.5) * 10;
        
        setSparkles(prev => [...prev.slice(-60), { id, x, y, size }]); // Keep more particles
        
        // Auto-remove after longer duration
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== id));
        }, 1500);
      }
      
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') !== null || 
        target.closest('a') !== null
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0, rotate: 0 }}
            animate={{ opacity: 0, scale: 1.2, rotate: 270, y: s.y + 20 }} // Slight downward drift
            transition={{ duration: 1.5, ease: "easeOut" }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 text-primary pointer-events-none z-[9998] hidden lg:block"
            style={{
              left: s.x,
              top: s.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <Sparkle size={s.size} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-[9999] hidden lg:block"
        animate={{
          scale: isClicking ? 0.8 : (isHovering ? 2 : 1),
          backgroundColor: isHovering ? "rgba(47, 141, 70, 0.1)" : "rgba(47, 141, 70, 0)",
          borderWidth: isClicking ? 4 : 2,
        }}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Click Ripple */}
      <AnimatePresence>
        {isClicking && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary pointer-events-none z-[9999]"
            style={{
              x: mouseX,
              y: mouseY,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
        )}
      </AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999] hidden lg:block shadow-[0_0_10px_#2f8d46]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Dynamic Glow Trail */}
      <motion.div
        className="fixed top-0 left-0 w-48 h-48 rounded-full bg-primary/20 blur-[80px] pointer-events-none z-[9998] hidden lg:block"
        animate={{
           scale: isHovering ? 1.5 : 1,
        }}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
