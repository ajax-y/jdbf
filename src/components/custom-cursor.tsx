"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') !== null || 
        target.closest('a') !== null
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-[9999] hidden lg:block"
        animate={{
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? "rgba(47, 141, 70, 0.1)" : "rgba(47, 141, 70, 0)",
        }}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999] hidden lg:block shadow-[0_0_10px_#2f8d46]"
        style={{
          x: useSpring(mouseX, { damping: 40, stiffness: 600 }),
          y: useSpring(mouseY, { damping: 40, stiffness: 600 }),
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
