"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useResponsive } from "@/hooks";

export function DeviceRotationHandler() {
  const { isMobile, isLandscape, screenHeight } = useResponsive();
  const [showRotationPrompt, setShowRotationPrompt] = useState(false);

  useEffect(() => {
    // Show rotation prompt for very small landscape screens
    if (isMobile && isLandscape && screenHeight < 500) {
      setShowRotationPrompt(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowRotationPrompt(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowRotationPrompt(false);
    }
    
    return undefined;
  }, [isMobile, isLandscape, screenHeight]);

  // Handle orientation change events
  useEffect(() => {
    const handleOrientationChange = () => {
      // Force a layout recalculation after orientation change
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  return (
    <AnimatePresence>
      {showRotationPrompt && (
        <motion.div
          className="fixed top-4 left-4 right-4 z-50 bg-primary text-primary-foreground rounded-lg p-4 shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                For the best experience, try rotating your device to portrait mode
              </p>
            </div>
            <button
              onClick={() => setShowRotationPrompt(false)}
              className="text-primary-foreground/80 hover:text-primary-foreground text-sm"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Component for handling safe area insets on mobile devices
export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (isMobile) {
      // Set CSS custom properties for safe area insets
      const updateSafeArea = () => {
        const safeAreaTop = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0px';
        const safeAreaBottom = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0px';
        
        document.documentElement.style.setProperty('--app-safe-area-top', safeAreaTop);
        document.documentElement.style.setProperty('--app-safe-area-bottom', safeAreaBottom);
      };

      updateSafeArea();
      window.addEventListener('resize', updateSafeArea);
      window.addEventListener('orientationchange', updateSafeArea);

      return () => {
        window.removeEventListener('resize', updateSafeArea);
        window.removeEventListener('orientationchange', updateSafeArea);
      };
    }
    
    return undefined;
  }, [isMobile]);

  return (
    <div className={isMobile ? 'safe-area-container' : ''}>
      {children}
    </div>
  );
}