"use client";

import { useEffect } from "react";
import { 
  preloadCriticalResources, 
  addResourceHints, 
  registerServiceWorker,
  measurePerformance 
} from "@/lib/performance";

export function PerformanceInitializer() {
  useEffect(() => {
    measurePerformance('performance-initialization', () => {
      // Initialize performance optimizations
      preloadCriticalResources();
      addResourceHints();
      registerServiceWorker();

      // Report initial performance metrics
      if (typeof window !== 'undefined' && 'performance' in window) {
        // Report navigation timing
        window.addEventListener('load', () => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (process.env.NODE_ENV === 'development') {
            console.log('🚀 Performance Metrics:');
            console.log(`  DNS Lookup: ${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`);
            console.log(`  TCP Connection: ${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`);
            console.log(`  Request: ${(navigation.responseStart - navigation.requestStart).toFixed(2)}ms`);
            console.log(`  Response: ${(navigation.responseEnd - navigation.responseStart).toFixed(2)}ms`);
            console.log(`  DOM Processing: ${(navigation.domContentLoadedEventEnd - navigation.responseEnd).toFixed(2)}ms`);
            console.log(`  Load Complete: ${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms`);
          }
        });

        // Report resource timing for critical resources
        window.addEventListener('load', () => {
          const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
          const criticalResources = resources.filter(resource => 
            resource.name.includes('/_next/static/') || 
            resource.name.includes('.woff2') ||
            resource.name.includes('og-image')
          );

          if (process.env.NODE_ENV === 'development' && criticalResources.length > 0) {
            console.log('📦 Critical Resource Loading:');
            criticalResources.forEach(resource => {
              console.log(`  ${resource.name.split('/').pop()}: ${resource.duration.toFixed(2)}ms`);
            });
          }
        });
      }
    });
  }, []);

  return null;
}