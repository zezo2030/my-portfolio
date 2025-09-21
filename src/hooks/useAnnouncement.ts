"use client";

import { useCallback } from "react";

export function useAnnouncement() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Create or get existing live region
    let liveRegion = document.getElementById('accessibility-announcements');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'accessibility-announcements';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    } else {
      liveRegion.setAttribute('aria-live', priority);
    }

    // Clear previous message and set new one
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion!.textContent = message;
    }, 100);

    // Clear message after announcement
    setTimeout(() => {
      if (liveRegion && liveRegion.textContent === message) {
        liveRegion.textContent = '';
      }
    }, 3000);
  }, []);

  return { announce };
}