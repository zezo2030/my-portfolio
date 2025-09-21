"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { createIntersectionObserver } from "@/lib/performance";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = "",
  placeholder,
  blurDataURL,
  width,
  height,
  priority = false,
  sizes,

  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const currentImg = imgRef.current;
    
    if (!currentImg || priority) return; // Skip observer if priority image

    // Create intersection observer with performance optimization
    observerRef.current = createIntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: "100px", // Increased for better UX
        threshold: 0.1
      }
    );

    if (observerRef.current) {
      observerRef.current.observe(currentImg);
    } else {
      // Fallback if IntersectionObserver not supported
      setIsInView(true);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          {placeholder ? (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          ) : (
            <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && !hasError && (
        <motion.img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            willChange: isLoaded ? 'auto' : 'opacity',
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-2xl mb-2">📷</div>
            <span className="text-sm">Failed to load image</span>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isInView && !isLoaded && !hasError && (
        <motion.div
          className="absolute inset-0 bg-background/50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 2 }}
        >
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
    </div>
  );
}