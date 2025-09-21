"use client";

import { useEffect, useState, useCallback } from "react";

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint
  domContentLoaded?: number;
  loadComplete?: number;
  bundleSize?: number;
}

interface PerformanceThresholds {
  fcp: { good: number; needsImprovement: number };
  lcp: { good: number; needsImprovement: number };
  fid: { good: number; needsImprovement: number };
  cls: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
  inp: { good: number; needsImprovement: number };
}

const THRESHOLDS: PerformanceThresholds = {
  fcp: { good: 1800, needsImprovement: 3000 },
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  ttfb: { good: 800, needsImprovement: 1800 },
  inp: { good: 200, needsImprovement: 500 },
};

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isSupported, setIsSupported] = useState(true);

  const getMetricStatus = useCallback((metric: keyof PerformanceThresholds, value: number) => {
    const threshold = THRESHOLDS[metric];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }, []);

  const reportMetric = useCallback((name: string, value: number, unit = 'ms') => {
    if (process.env.NODE_ENV === 'development') {
      const status = name in THRESHOLDS ? getMetricStatus(name as keyof PerformanceThresholds, value) : 'unknown';
      console.log(`🔍 ${name.toUpperCase()}: ${value.toFixed(2)}${unit} (${status})`);
    }
    
    // In production, you could send to analytics service
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Example: Send to Google Analytics 4
      if ('gtag' in window) {
        (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'web_vitals', {
          name,
          value: Math.round(value),
          event_category: 'Web Vitals',
        });
      }
    }
  }, [getMetricStatus]);

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Check if Performance Observer is supported
    if (!('PerformanceObserver' in window)) {
      setIsSupported(false);
      console.warn('PerformanceObserver not supported');
      return;
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case "paint":
            if (entry.name === "first-contentful-paint") {
              const fcp = entry.startTime;
              setMetrics(prev => ({ ...prev, fcp }));
              reportMetric('fcp', fcp);
            }
            break;
          
          case "largest-contentful-paint":
            const lcp = entry.startTime;
            setMetrics(prev => ({ ...prev, lcp }));
            reportMetric('lcp', lcp);
            break;
          
          case "first-input":
            const fidEntry = entry as PerformanceEntry & {
              processingStart?: number;
            };
            if (fidEntry.processingStart) {
              const fid = fidEntry.processingStart - entry.startTime;
              setMetrics(prev => ({ ...prev, fid }));
              reportMetric('fid', fid);
            }
            break;
          
          case "layout-shift":
            const layoutShiftEntry = entry as PerformanceEntry & {
              hadRecentInput?: boolean;
              value?: number;
            };
            if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
              setMetrics(prev => {
                const newCls = (prev.cls || 0) + layoutShiftEntry.value!;
                reportMetric('cls', newCls, '');
                return { ...prev, cls: newCls };
              });
            }
            break;
          
          case "event":
            // Interaction to Next Paint (INP)
            const eventEntry = entry as PerformanceEntry & {
              interactionId?: number;
              processingStart?: number;
              processingEnd?: number;
            };
            if (eventEntry.interactionId && eventEntry.processingEnd) {
              const inp = eventEntry.processingEnd - entry.startTime;
              setMetrics(prev => ({ ...prev, inp }));
              reportMetric('inp', inp);
            }
            break;
          
          case "navigation":
            const navEntry = entry as PerformanceNavigationTiming;
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            const domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
            const loadComplete = navEntry.loadEventEnd - navEntry.fetchStart;
            
            setMetrics(prev => ({ 
              ...prev, 
              ttfb,
              domContentLoaded,
              loadComplete
            }));
            
            reportMetric('ttfb', ttfb);
            reportMetric('domContentLoaded', domContentLoaded);
            reportMetric('loadComplete', loadComplete);
            break;
        }
      }
    });

    // Observe different entry types with error handling
    const entryTypes = [
      'paint',
      'largest-contentful-paint',
      'first-input',
      'layout-shift',
      'navigation',
      'event'
    ];

    entryTypes.forEach(type => {
      try {
        observer.observe({ entryTypes: [type] });
      } catch (error) {
        console.warn(`Performance Observer type '${type}' not supported:`, error);
      }
    });

    // Measure bundle size (approximate)
    const measureBundleSize = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const jsResources = resources.filter(resource => 
          resource.name.includes('.js') && 
          (resource.name.includes('/_next/') || resource.name.includes('/static/'))
        );
        
        const totalSize = jsResources.reduce((total, resource) => {
          return total + (resource.transferSize || 0);
        }, 0);
        
        if (totalSize > 0) {
          setMetrics(prev => ({ ...prev, bundleSize: totalSize }));
          reportMetric('bundleSize', totalSize / 1024, 'KB');
        }
      }
    };

    // Measure bundle size after load
    if (document.readyState === 'complete') {
      measureBundleSize();
    } else {
      window.addEventListener('load', measureBundleSize);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('load', measureBundleSize);
    };
  }, [reportMetric]);

  // Performance summary
  const getPerformanceSummary = useCallback(() => {
    const summary = {
      overall: 'good' as 'good' | 'needs-improvement' | 'poor',
      scores: {} as Record<string, string>,
      recommendations: [] as string[],
    };

    Object.entries(metrics).forEach(([key, value]) => {
      if (key in THRESHOLDS && typeof value === 'number') {
        const status = getMetricStatus(key as keyof PerformanceThresholds, value);
        summary.scores[key] = status;
        
        if (status === 'poor') {
          summary.overall = 'poor';
        } else if (status === 'needs-improvement' && summary.overall === 'good') {
          summary.overall = 'needs-improvement';
        }
      }
    });

    // Generate recommendations
    if (metrics.lcp && metrics.lcp > THRESHOLDS.lcp.good) {
      summary.recommendations.push('Optimize images and reduce server response times to improve LCP');
    }
    if (metrics.cls && metrics.cls > THRESHOLDS.cls.good) {
      summary.recommendations.push('Add size attributes to images and avoid inserting content above existing content');
    }
    if (metrics.fid && metrics.fid > THRESHOLDS.fid.good) {
      summary.recommendations.push('Reduce JavaScript execution time and break up long tasks');
    }
    if (metrics.bundleSize && metrics.bundleSize > 500 * 1024) { // 500KB
      summary.recommendations.push('Consider code splitting and lazy loading to reduce bundle size');
    }

    return summary;
  }, [metrics, getMetricStatus]);

  return {
    metrics,
    isSupported,
    getPerformanceSummary,
    getMetricStatus,
  };
}