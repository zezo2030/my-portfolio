"use client";

import { useEffect, useState } from 'react';
import { auditSEO, generateSEOReport, type SEOAuditResult } from '@/lib/seo-audit';
// SEO Checklist component for development

// Removed unused interface SEOCheck

export function SEOChecklist() {
  const [auditResult, setAuditResult] = useState<SEOAuditResult | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const performSEOAudit = () => {
      const result = auditSEO();
      setAuditResult(result);
    };

    // Run audit after a delay to ensure DOM is ready
    const timer = setTimeout(performSEOAudit, 2000);
    return () => clearTimeout(timer);
  }, []);

  const downloadReport = () => {
    const report = generateSEOReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seo-audit-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors z-50"
        style={{ display: process.env.NODE_ENV === 'development' ? 'block' : 'none' }}
      >
        SEO Audit {auditResult && `(${auditResult.score}/100)`}
      </button>
    );
  }

  if (!auditResult) {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-w-sm z-50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Running SEO audit...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-md z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">SEO Audit</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              auditResult.score >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              auditResult.score >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {auditResult.score}/100
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Performance Metrics */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Performance</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Images: {auditResult.performance.imageOptimization}%</div>
            <div>Meta Tags: {auditResult.performance.metaTagsComplete}%</div>
            <div>Mobile: {auditResult.performance.mobileOptimized ? '✓' : '✗'}</div>
            <div>Schema: {auditResult.performance.structuredDataPresent ? '✓' : '✗'}</div>
          </div>
        </div>
        
        {/* Issues Summary */}
        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {auditResult.issues.length === 0 ? (
            <div className="text-sm text-green-600 dark:text-green-400 text-center py-2">
              🎉 No SEO issues found!
            </div>
          ) : (
            <>
              {auditResult.issues.filter(issue => issue.priority === 'high').map((issue, index) => (
                <div key={`high-${index}`} className="flex items-start gap-2 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-500" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-red-900 dark:text-red-200">{issue.message}</div>
                    <div className="text-red-700 dark:text-red-300 text-xs">{issue.fix}</div>
                  </div>
                </div>
              ))}
              {auditResult.issues.filter(issue => issue.priority === 'medium').slice(0, 3).map((issue, index) => (
                <div key={`medium-${index}`} className="flex items-start gap-2 text-sm p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-yellow-500" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-yellow-900 dark:text-yellow-200">{issue.message}</div>
                    <div className="text-yellow-700 dark:text-yellow-300 text-xs">{issue.fix}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={downloadReport}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            Download Report
          </button>
          <button
            onClick={() => setShowReport(!showReport)}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {showReport ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {/* Detailed Report */}
        {showReport && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg max-h-48 overflow-y-auto">
            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {generateSEOReport()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}