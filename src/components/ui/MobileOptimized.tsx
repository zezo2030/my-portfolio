"use client";

import { ReactNode, useEffect, useState } from "react";
import { useResponsive, useDeviceCapabilities } from "@/hooks";

interface MobileOptimizedProps {
  children: ReactNode;
  fallback?: ReactNode;
  enableLazyLoading?: boolean;
  className?: string;
}

export function MobileOptimized({ 
  children, 
  fallback, 
  enableLazyLoading = true,
  className = ""
}: MobileOptimizedProps) {
  const { isMobile, isTablet } = useResponsive();
  const { supportsTouch } = useDeviceCapabilities();
  const [isVisible, setIsVisible] = useState(!enableLazyLoading);

  useEffect(() => {
    if (!enableLazyLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    const element = document.querySelector(`[data-mobile-optimized]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [enableLazyLoading]);

  if (!isVisible && enableLazyLoading) {
    return (
      <div 
        data-mobile-optimized
        className={`${className} ${isMobile ? 'min-h-[200px]' : 'min-h-[300px]'} flex items-center justify-center`}
      >
        {fallback || (
          <div className="animate-pulse bg-muted rounded-lg w-full h-32" />
        )}
      </div>
    );
  }

  return (
    <div 
      className={`${className} ${
        isMobile || isTablet ? 'mobile-optimized' : ''
      } ${supportsTouch ? 'touch-optimized' : ''}`}
      data-mobile-optimized
    >
      {children}
    </div>
  );
}

// Hook for mobile-specific image optimization
export function useMobileImageOptimization() {
  const { isMobile, screenWidth } = useResponsive();
  const { hasHighDPI } = useDeviceCapabilities();

  const getOptimizedImageSize = (baseWidth: number, baseHeight: number) => {
    if (!isMobile) return { width: baseWidth, height: baseHeight };

    const scaleFactor = Math.min(screenWidth / baseWidth, 0.8);

    return {
      width: Math.round(baseWidth * scaleFactor),
      height: Math.round(baseHeight * scaleFactor),
      srcSet: hasHighDPI ? `${baseWidth * scaleFactor}w, ${baseWidth * scaleFactor * 2}w 2x` : undefined
    };
  };

  return { getOptimizedImageSize, isMobile, hasHighDPI };
}

// Component for mobile-optimized text
interface MobileTextProps {
  children: ReactNode;
  mobileSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  desktopSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  className?: string;
}

export function MobileText({ 
  children, 
  mobileSize = 'base', 
  desktopSize = 'lg',
  className = ""
}: MobileTextProps) {
  const { isMobile } = useResponsive();

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
  };

  const textClass = isMobile ? sizeClasses[mobileSize] : sizeClasses[desktopSize];

  return (
    <span className={`${textClass} ${className}`}>
      {children}
    </span>
  );
}