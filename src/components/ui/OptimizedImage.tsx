"use client";

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">📷</div>
          <span className="text-sm">Image not available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
          style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
        >
          <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Optimized Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={sizes || (fill ? '100vw' : `${width}px`)}
          loading={priority ? 'eager' : loading}
          onLoad={handleLoad}
          onError={handleError}
          className={fill ? 'object-cover' : ''}
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </motion.div>
    </div>
  );
}

// Hook for generating responsive image sizes
export function useResponsiveImageSizes() {
  return {
    hero: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
    thumbnail: '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px',
    fullWidth: '100vw',
    avatar: '(max-width: 768px) 150px, (max-width: 1200px) 200px, 250px',
  };
}

// Generate blur data URL for placeholder
export function generateBlurDataURL(): string {
  // Use a simple base64 encoded blur placeholder
  return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
}

// Avatar component with optimized image loading and proper alt text
interface AvatarImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
  priority?: boolean;
}

export function AvatarImage({ 
  src, 
  alt, 
  size = 'md', 
  fallback, 
  className = '',
  priority = false
}: AvatarImageProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const sizePixels = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96
  };

  if (!src) {
    return (
      <div 
        className={`rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-semibold ${sizeClasses[size]} ${className}`}
        role="img"
        aria-label={alt}
      >
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={sizePixels[size]}
      height={sizePixels[size]}
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      priority={priority || size === 'xl'}
      quality={90}
      sizes={`${sizePixels[size]}px`}
      placeholder="blur"
      blurDataURL={generateBlurDataURL()}
    />
  );
}

// SEO-optimized image component with structured data
interface SEOImageProps extends OptimizedImageProps {
  caption?: string;
  credit?: string;
  license?: string;
  structuredData?: boolean;
}

export function SEOImage({
  src,
  alt,
  caption,
  credit,
  license,
  structuredData = false,
  ...props
}: SEOImageProps) {
  const imageStructuredData = structuredData ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: src,
    description: alt,
    caption: caption,
    creditText: credit,
    license: license,
    width: props.width,
    height: props.height,
  } : null;

  return (
    <figure className="space-y-2">
      {imageStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(imageStructuredData),
          }}
        />
      )}
      <OptimizedImage
        src={src}
        alt={alt}
        {...props}
      />
      {(caption || credit) && (
        <figcaption className="text-sm text-muted-foreground text-center">
          {caption && <span>{caption}</span>}
          {credit && (
            <span className={caption ? ' • ' : ''}>
              Credit: {credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}