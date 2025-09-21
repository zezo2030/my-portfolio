"use client";

import { useState, useEffect } from "react";

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  isTouchDevice: boolean;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLandscape: false,
    screenWidth: 0,
    screenHeight: 0,
    isTouchDevice: false,
  });

  useEffect(() => {
    const updateResponsiveState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isLandscape: width > height,
        screenWidth: width,
        screenHeight: height,
        isTouchDevice,
      });
    };

    // Initial check
    updateResponsiveState();

    // Listen for resize and orientation changes
    window.addEventListener('resize', updateResponsiveState);
    window.addEventListener('orientationchange', () => {
      // Delay to ensure orientation change is complete
      setTimeout(updateResponsiveState, 100);
    });

    return () => {
      window.removeEventListener('resize', updateResponsiveState);
      window.removeEventListener('orientationchange', updateResponsiveState);
    };
  }, []);

  return state;
}

// Hook for detecting if user prefers reduced motion
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Hook for detecting device capabilities
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    supportsHover: false,
    supportsTouch: false,
    hasCoarsePointer: false,
    hasHighDPI: false,
    prefersReducedMotion: false,
    hasKeyboard: true,
  });

  useEffect(() => {
    const updateCapabilities = () => {
      const supportsHover = window.matchMedia('(hover: hover)').matches;
      const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const hasHighDPI = window.devicePixelRatio > 1;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasKeyboard = !hasCoarsePointer || window.matchMedia('(any-hover: hover)').matches;

      setCapabilities({
        supportsHover,
        supportsTouch,
        hasCoarsePointer,
        hasHighDPI,
        prefersReducedMotion,
        hasKeyboard,
      });
    };

    // Initial check
    updateCapabilities();

    // Listen for changes
    const mediaQueries = [
      window.matchMedia('(hover: hover)'),
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(any-hover: hover)'),
    ];

    mediaQueries.forEach(mq => {
      mq.addEventListener('change', updateCapabilities);
    });

    return () => {
      mediaQueries.forEach(mq => {
        mq.removeEventListener('change', updateCapabilities);
      });
    };
  }, []);

  return capabilities;
}