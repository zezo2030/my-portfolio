"use client";

import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { AccessibilityChecker, type AccessibilityCheckResult } from "@/lib/accessibility-utils";
import { CheckCircle, XCircle, AlertTriangle, Play } from "lucide-react";

interface AccessibilityTestResults {
  [key: string]: AccessibilityCheckResult[];
}

export function AccessibilityTester() {
  const [results, setResults] = useState<AccessibilityTestResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const testResults = AccessibilityChecker.runAllChecks();
    setResults(testResults);
    setIsRunning(false);
  };

  const getTestSummary = () => {
    if (!results) return { total: 0, passed: 0, failed: 0 };
    
    let total = 0;
    let passed = 0;
    
    Object.values(results).forEach(testResults => {
      total += testResults.length;
      passed += testResults.filter(r => r.passed).length;
    });
    
    return { total, passed, failed: total - passed };
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getTestCategoryName = (key: string) => {
    const names: { [key: string]: string } = {
      imageAltText: "Image Alt Text",
      formLabels: "Form Labels",
      colorContrast: "Color Contrast",
      keyboardAccessibility: "Keyboard Accessibility",
      headingHierarchy: "Heading Hierarchy",
      ariaAttributes: "ARIA Attributes"
    };
    return names[key] || key;
  };

  const summary = getTestSummary();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          className="rounded-full shadow-lg"
          size="icon"
          aria-label="Open accessibility tester"
        >
          <AlertTriangle className="w-4 h-4" />
        </Button>
      ) : (
        <Card className="w-96 max-h-96 overflow-hidden shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Accessibility Tests</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                aria-label="Close accessibility tester"
              >
                ×
              </Button>
            </div>
            <CardDescription>
              WCAG 2.1 AA compliance testing
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={runTests}
                disabled={isRunning}
                size="sm"
                className="flex-1"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>
            </div>

            {results && (
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Summary</span>
                    <span className={`font-medium ${
                      summary.failed === 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {summary.passed}/{summary.total} passed
                    </span>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2">
                  {Object.entries(results).map(([category, testResults]) => {
                    const categoryPassed = testResults.filter(r => r.passed).length;
                    const categoryTotal = testResults.length;
                    const allPassed = categoryPassed === categoryTotal;

                    return (
                      <div key={category} className="border rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {getTestCategoryName(category)}
                          </span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(allPassed)}
                            <span className="text-xs">
                              {categoryPassed}/{categoryTotal}
                            </span>
                          </div>
                        </div>
                        
                        {!allPassed && (
                          <div className="space-y-1">
                            {testResults
                              .filter(r => !r.passed)
                              .slice(0, 3)
                              .map((result, index) => (
                                <div key={index} className="text-xs text-red-600 pl-2">
                                  • {result.message}
                                </div>
                              ))}
                            {testResults.filter(r => !r.passed).length > 3 && (
                              <div className="text-xs text-muted-foreground pl-2">
                                +{testResults.filter(r => !r.passed).length - 3} more issues
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const report = AccessibilityChecker.generateReport();
                    console.log(report);
                    navigator.clipboard?.writeText(report);
                  }}
                  className="w-full text-xs"
                >
                  Copy Report to Clipboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}