"use client";

import { motion, MotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "./ReducedMotionProvider";

interface MotionWrapperProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  reducedMotionVariants?: Variants;
  className?: string;
}

export function MotionWrapper({
  children,
  variants,
  reducedMotionVariants,
  className,
  ...motionProps
}: MotionWrapperProps) {
  const { prefersReducedMotion } = useReducedMotion();

  // Use reduced motion variants if available and user prefers reduced motion
  const finalVariants = prefersReducedMotion && reducedMotionVariants 
    ? reducedMotionVariants 
    : variants;

  // Disable animations if user prefers reduced motion and no reduced variants provided
  const shouldAnimate = !prefersReducedMotion || reducedMotionVariants;

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={finalVariants}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

// Reduced motion variants that provide subtle animations
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

export const reducedMotionStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};