"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ReducedMotionContextType {
  prefersReducedMotion: boolean;
}

const ReducedMotionContext = createContext<ReducedMotionContextType>({
  prefersReducedMotion: false
});

export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}

interface ReducedMotionProviderProps {
  children: ReactNode;
}

export function ReducedMotionProvider({ children }: ReducedMotionProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <ReducedMotionContext.Provider value={{ prefersReducedMotion }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}