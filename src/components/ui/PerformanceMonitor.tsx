"use client";

import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useState, useEffect } from "react";

interface PerformanceMonitorProps {
  showInProduction?: boolean;
}

export function PerformanceMonitor({ showInProduction = false }: PerformanceMonitorProps) {
  const { metrics, isSupported, getPerformanceSummary } = usePerformanceMonitor();
  const [isVisible, setIsVisible] = useState(false);
  const [summary, setSummary] = useState(getPerformanceSummary());

  // Only show in development unless explicitly enabled for production
  const shouldShow = process.env.NODE_ENV === 'development' || showInProduction;

  useEffect(() => {
    setSummary(getPerformanceSummary());
  }, [metrics, getPerformanceSummary]);

  useEffect(() => {
    // Show performance monitor with keyboard shortcut (Ctrl/Cmd + Shift + P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    if (shouldShow) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
    
    return undefined;
  }, [shouldShow]);

  if (!shouldShow || !isSupported) return null;

  const formatValue = (value: number | undefined, unit = 'ms') => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(2)}${unit}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(prev => !prev)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Toggle Performance Monitor (Ctrl/Cmd + Shift + P)"
      >
        📊
      </button>

      {/* Performance panel */}
      {isVisible && (
        <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-w-sm w-full max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Overall status */}
          <div className={`mb-4 p-2 rounded ${
            summary.overall === 'good' ? 'bg-green-100 dark:bg-green-900/20' :
            summary.overall === 'needs-improvement' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
            'bg-red-100 dark:bg-red-900/20'
          }`}>
            <div className={`font-medium ${getStatusColor(summary.overall)}`}>
              Overall: {summary.overall.replace('-', ' ').toUpperCase()}
            </div>
          </div>

          {/* Core Web Vitals */}
          <div className="space-y-2 mb-4">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Core Web Vitals</h4>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">FCP:</span>
                <span className={`ml-1 ${getStatusColor(summary.scores.fcp || 'unknown')}`}>
                  {formatValue(metrics.fcp)}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">LCP:</span>
                <span className={`ml-1 ${getStatusColor(summary.scores.lcp || 'unknown')}`}>
                  {formatValue(metrics.lcp)}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">FID:</span>
                <span className={`ml-1 ${getStatusColor(summary.scores.fid || 'unknown')}`}>
                  {formatValue(metrics.fid)}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">CLS:</span>
                <span className={`ml-1 ${getStatusColor(summary.scores.cls || 'unknown')}`}>
                  {formatValue(metrics.cls, '')}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">TTFB:</span>
                <span className={`ml-1 ${getStatusColor(summary.scores.ttfb || 'unknown')}`}>
                  {formatValue(metrics.ttfb)}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">INP:</span>
                <span className={`ml-1 ${getStatusColor(summary.scores.inp || 'unknown')}`}>
                  {formatValue(metrics.inp)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional metrics */}
          <div className="space-y-2 mb-4">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Additional Metrics</h4>
            
            <div className="text-sm space-y-1">
              <div>
                <span className="text-gray-600 dark:text-gray-400">DOM Ready:</span>
                <span className="ml-1">{formatValue(metrics.domContentLoaded)}</span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Load Complete:</span>
                <span className="ml-1">{formatValue(metrics.loadComplete)}</span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Bundle Size:</span>
                <span className="ml-1">{formatValue(metrics.bundleSize ? metrics.bundleSize / 1024 : undefined, 'KB')}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {summary.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Recommendations</h4>
              <ul className="text-xs space-y-1">
                {summary.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            Press Ctrl/Cmd + Shift + P to toggle
          </div>
        </div>
      )}
    </>
  );
}