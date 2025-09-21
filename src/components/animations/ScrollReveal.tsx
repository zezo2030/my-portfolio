"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  variants?: Variants;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export function ScrollReveal({
  children,
  variants = defaultVariants,
  delay = 0,
  duration = 0.6,
  className = "",
  threshold = 0.1,
  once = true
}: ScrollRevealProps) {
  // Create custom variants with delay and duration
  const customVariants: Variants = {
    hidden: variants.hidden || { opacity: 0, y: 50 },
    visible: {
      ...(variants.visible || { opacity: 1, y: 0 }),
      transition: {
        ...(typeof variants.visible === 'object' && variants.visible && 'transition' in variants.visible 
          ? variants.visible.transition 
          : {}),
        delay,
        duration
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={customVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once, 
        margin: `-${(1 - threshold) * 100}% 0px -${(1 - threshold) * 100}% 0px` 
      }}
    >
      {children}
    </motion.div>
  );
}