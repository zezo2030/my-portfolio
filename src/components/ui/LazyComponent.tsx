"use client";

import { ReactNode, Suspense } from "react";
import { useIntersectionObserver } from "@/hooks";

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyComponent({
  children,
  fallback = <div className="animate-pulse bg-muted rounded-lg h-32" />,
  threshold = 0.1,
  rootMargin = "100px",
  className = ""
}: LazyComponentProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  return (
    <div ref={elementRef} className={className}>
      {isIntersecting ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}