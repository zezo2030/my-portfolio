import { lazy, ComponentType, createElement } from 'react';

// Lazy loading utility with error boundary
export function lazyWithRetry<T extends ComponentType<unknown>>(
  componentImport: () => Promise<{ default: T }>,
  name: string
) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error(`Failed to load component ${name}:`, error);
      // Return a fallback component
      return {
        default: (() => 
          createElement('div', {
            className: 'p-4 text-center text-red-600'
          }, `Failed to load ${name}. Please refresh the page.`)
        ) as unknown as T,
      };
    }
  });
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontPreloads = [
    '/fonts/inter-var.woff2',
    '/fonts/inter-var-italic.woff2',
  ];

  fontPreloads.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = [
    '/og-image.jpg',
    '/favicon.svg',
  ];

  criticalImages.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'image';
    document.head.appendChild(link);
  });
}

// Resource hints for external domains
export function addResourceHints() {
  if (typeof window === 'undefined') return;

  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  ];

  hints.forEach(({ rel, href, crossOrigin }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    document.head.appendChild(link);
  });
}

// Optimize third-party scripts
export function loadThirdPartyScript(
  src: string,
  options: {
    async?: boolean;
    defer?: boolean;
    onLoad?: () => void;
    onError?: () => void;
  } = {}
) {
  if (typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.src = src;
  script.async = options.async ?? true;
  script.defer = options.defer ?? false;
  
  if (options.onLoad) script.onload = options.onLoad;
  if (options.onError) script.onerror = options.onError;

  document.head.appendChild(script);
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Performance timing utilities
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return fn();
  }

  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-duration`;

  performance.mark(startMark);
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
      
      const measure = performance.getEntriesByName(measureName)[0];
      if (process.env.NODE_ENV === 'development' && measure) {
        console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
      }
    });
  } else {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    
    const measure = performance.getEntriesByName(measureName)[0];
    if (process.env.NODE_ENV === 'development' && measure) {
      console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
    }
    
    return result;
  }
}

// Bundle size monitoring
export function getBundleSize(): Promise<number> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      resolve(0);
      return;
    }

    // Wait for all resources to load
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(resource => 
        resource.name.includes('.js') && 
        (resource.name.includes('/_next/') || resource.name.includes('/static/'))
      );
      
      const totalSize = jsResources.reduce((total, resource) => {
        return total + (resource.transferSize || resource.encodedBodySize || 0);
      }, 0);
      
      resolve(totalSize);
    });
  });
}

// Critical CSS inlining helper
export function inlineCriticalCSS(css: string) {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    process.env.NODE_ENV === 'production'
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Image optimization helpers
export function getOptimizedImageProps(
  src: string,
  width: number,
  height: number,
  quality = 75
) {
  return {
    src,
    width,
    height,
    quality,
    placeholder: 'blur' as const,
    blurDataURL: `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
      </svg>`
    ).toString('base64')}`,
  };
}

// Prefetch next page resources
export function prefetchRoute(href: string) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}