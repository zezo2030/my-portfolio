"use client";

import { useState, useEffect, useCallback } from "react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  check: () => boolean | Promise<boolean>;
  status: 'pass' | 'fail' | 'warning' | 'pending';
}

export function PerformanceChecklist() {
  const { metrics } = usePerformanceMonitor();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const items: ChecklistItem[] = [
      {
        id: 'fcp',
        title: 'First Contentful Paint < 1.8s',
        description: 'Time until first text or image is painted',
        check: () => (metrics.fcp || 0) < 1800,
        status: 'pending',
      },
      {
        id: 'lcp',
        title: 'Largest Contentful Paint < 2.5s',
        description: 'Time until largest text or image is painted',
        check: () => (metrics.lcp || 0) < 2500,
        status: 'pending',
      },
      {
        id: 'cls',
        title: 'Cumulative Layout Shift < 0.1',
        description: 'Visual stability of the page',
        check: () => (metrics.cls || 0) < 0.1,
        status: 'pending',
      },
      {
        id: 'fid',
        title: 'First Input Delay < 100ms',
        description: 'Time from first user interaction to browser response',
        check: () => (metrics.fid || 0) < 100,
        status: 'pending',
      },
      {
        id: 'ttfb',
        title: 'Time to First Byte < 800ms',
        description: 'Server response time',
        check: () => (metrics.ttfb || 0) < 800,
        status: 'pending',
      },
      {
        id: 'bundle-size',
        title: 'Bundle Size < 500KB',
        description: 'Total JavaScript bundle size',
        check: () => (metrics.bundleSize || 0) < 500 * 1024,
        status: 'pending',
      },
      {
        id: 'images-optimized',
        title: 'Images Optimized',
        description: 'Using WebP/AVIF formats and proper sizing',
        check: async () => {
          const images = document.querySelectorAll('img');
          let optimized = 0;
          images.forEach(img => {
            if (img.src.includes('.webp') || img.src.includes('.avif') || img.hasAttribute('loading')) {
              optimized++;
            }
          });
          return optimized / images.length > 0.8;
        },
        status: 'pending',
      },
      {
        id: 'fonts-optimized',
        title: 'Fonts Optimized',
        description: 'Using font-display: swap and preloading',
        check: () => {
          const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
          return fontLinks.length > 0;
        },
        status: 'pending',
      },
      {
        id: 'service-worker',
        title: 'Service Worker Active',
        description: 'Caching strategy implemented',
        check: async () => {
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            return !!registration;
          }
          return false;
        },
        status: 'pending',
      },
      {
        id: 'compression',
        title: 'Compression Enabled',
        description: 'Gzip/Brotli compression for text assets',
        check: async () => {
          try {
            const response = await fetch(window.location.href, { method: 'HEAD' });
            return response.headers.get('content-encoding') !== null;
          } catch {
            return false;
          }
        },
        status: 'pending',
      },
    ];

    setChecklist(items);
  }, [metrics]);

  const runChecks = useCallback(async () => {
    const updatedChecklist = await Promise.all(
      checklist.map(async (item): Promise<ChecklistItem> => {
        try {
          const result = await item.check();
          return {
            ...item,
            status: result ? ('pass' as const) : ('fail' as const),
          };
        } catch (error) {
          console.warn(`Check failed for ${item.id}:`, error);
          return {
            ...item,
            status: 'warning' as const,
          };
        }
      })
    );
    setChecklist(updatedChecklist);
  }, [checklist]);

  useEffect(() => {
    // Run checks when metrics are available
    if (Object.keys(metrics).length > 0) {
      runChecks();
    }
  }, [metrics, runChecks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600';
      case 'fail': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const passedChecks = checklist.filter(item => item.status === 'pass').length;
  const totalChecks = checklist.length;
  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <button
        onClick={() => setIsVisible(prev => !prev)}
        className="fixed bottom-16 right-4 z-50 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        title="Performance Checklist"
      >
        📋
      </button>

      {isVisible && (
        <div className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-w-md w-full max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Performance Checklist</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Score</span>
              <span className={`text-lg font-bold ${
                score >= 80 ? 'text-green-600' : 
                score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  score >= 80 ? 'bg-green-600' : 
                  score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {passedChecks} of {totalChecks} checks passed
            </div>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item.id} className="border-b border-gray-100 dark:border-gray-700 pb-2">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{getStatusIcon(item.status)}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${getStatusColor(item.status)}`}>
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={runChecks}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Re-run Checks
            </button>
          </div>
        </div>
      )}
    </>
  );
}