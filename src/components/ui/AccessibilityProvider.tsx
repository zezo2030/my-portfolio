"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useDeviceCapabilities } from "@/hooks";

interface AccessibilityContextType {
  prefersReducedMotion: boolean;
  hasKeyboard: boolean;
  supportsTouch: boolean;
  hasCoarsePointer: boolean;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { prefersReducedMotion, hasKeyboard, supportsTouch, hasCoarsePointer } = useDeviceCapabilities();
  const [liveRegion, setLiveRegion] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create live region for screen reader announcements
    const region = document.createElement('div');
    region.id = 'accessibility-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    setLiveRegion(region);

    return () => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    };
  }, []);

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!liveRegion) return;

    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = '';
    
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = message;
      }
    }, 100);

    setTimeout(() => {
      if (liveRegion && liveRegion.textContent === message) {
        liveRegion.textContent = '';
      }
    }, 3000);
  };

  const value = {
    prefersReducedMotion,
    hasKeyboard,
    supportsTouch,
    hasCoarsePointer,
    announceToScreenReader,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}