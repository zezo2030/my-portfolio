// SEO Audit utility for development and testing

export interface SEOAuditResult {
  score: number;
  issues: SEOIssue[];
  recommendations: string[];
  performance: PerformanceMetrics;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'meta' | 'content' | 'performance' | 'accessibility' | 'structure' | 'images';
  message: string;
  element?: string;
  fix?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface PerformanceMetrics {
  imageOptimization: number;
  metaTagsComplete: number;
  structuredDataPresent: boolean;
  mobileOptimized: boolean;
  socialMediaOptimized: number;
}

export function auditSEO(): SEOAuditResult {
  const issues: SEOIssue[] = [];
  const recommendations: string[] = [];

  // Check title tag
  const title = document.title;
  if (!title) {
    issues.push({
      type: 'error',
      category: 'meta',
      message: 'Missing page title',
      fix: 'Add a descriptive title tag',
      priority: 'high'
    });
  } else if (title.length > 60) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: `Title too long (${title.length} characters)`,
      fix: 'Keep title under 60 characters',
      priority: 'medium'
    });
  } else if (title.length < 30) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: `Title too short (${title.length} characters)`,
      fix: 'Make title more descriptive (30-60 characters)',
      priority: 'medium'
    });
  }

  // Check meta description
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
  if (!metaDescription) {
    issues.push({
      type: 'error',
      category: 'meta',
      message: 'Missing meta description',
      fix: 'Add a meta description tag',
      priority: 'high'
    });
  } else if (metaDescription.length > 160) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: `Meta description too long (${metaDescription.length} characters)`,
      fix: 'Keep meta description under 160 characters',
      priority: 'medium'
    });
  } else if (metaDescription.length < 120) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: `Meta description too short (${metaDescription.length} characters)`,
      fix: 'Make meta description more descriptive (120-160 characters)',
      priority: 'low'
    });
  }

  // Check H1 tags
  const h1Tags = document.querySelectorAll('h1');
  if (h1Tags.length === 0) {
    issues.push({
      type: 'error',
      category: 'structure',
      message: 'No H1 tag found',
      fix: 'Add exactly one H1 tag per page',
      priority: 'high'
    });
  } else if (h1Tags.length > 1) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: `Multiple H1 tags found (${h1Tags.length})`,
      fix: 'Use only one H1 tag per page',
      priority: 'medium'
    });
  }

  // Check heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    if (index > 0 && currentLevel > previousLevel + 1) {
      issues.push({
        type: 'warning',
        category: 'structure',
        message: `Heading hierarchy skip detected: ${heading.tagName}`,
        element: heading.textContent?.substring(0, 50) || '',
        fix: 'Maintain proper heading hierarchy (don\'t skip levels)',
        priority: 'medium'
      });
    }
    previousLevel = currentLevel;
  });

  // Check images without alt text
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt: Element[] = [];
  const imagesWithEmptyAlt: Element[] = [];
  const nextImages = document.querySelectorAll('img[src*="_next"]');

  images.forEach(img => {
    const alt = img.getAttribute('alt');
    if (!alt) {
      imagesWithoutAlt.push(img);
    } else if (alt.trim() === '') {
      imagesWithEmptyAlt.push(img);
    }
  });

  if (imagesWithoutAlt.length > 0) {
    issues.push({
      type: 'error',
      category: 'images',
      message: `${imagesWithoutAlt.length} images without alt text`,
      fix: 'Add descriptive alt text to all images',
      priority: 'high'
    });
  }

  if (imagesWithEmptyAlt.length > 0) {
    issues.push({
      type: 'warning',
      category: 'images',
      message: `${imagesWithEmptyAlt.length} images with empty alt text`,
      fix: 'Add meaningful alt text or use alt="" for decorative images',
      priority: 'medium'
    });
  }

  // Check for Next.js Image optimization
  const regularImages = images.length - nextImages.length;
  if (regularImages > 0) {
    issues.push({
      type: 'warning',
      category: 'performance',
      message: `${regularImages} images not using Next.js Image optimization`,
      fix: 'Use next/image component for better performance',
      priority: 'medium'
    });
  }

  // Check for Open Graph tags
  const ogTags = {
    title: document.querySelector('meta[property="og:title"]'),
    description: document.querySelector('meta[property="og:description"]'),
    image: document.querySelector('meta[property="og:image"]'),
    url: document.querySelector('meta[property="og:url"]'),
    type: document.querySelector('meta[property="og:type"]')
  };

  const missingOgTags = Object.entries(ogTags).filter(([, element]) => !element);
  if (missingOgTags.length > 0) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: `Missing Open Graph tags: ${missingOgTags.map(([key]) => key).join(', ')}`,
      fix: 'Add missing Open Graph meta tags for better social sharing',
      priority: 'medium'
    });
  }

  // Check for Twitter Card tags
  const twitterTags = {
    card: document.querySelector('meta[name="twitter:card"]'),
    title: document.querySelector('meta[name="twitter:title"]'),
    description: document.querySelector('meta[name="twitter:description"]'),
    image: document.querySelector('meta[name="twitter:image"]')
  };

  const missingTwitterTags = Object.entries(twitterTags).filter(([, element]) => !element);
  if (missingTwitterTags.length > 0) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: `Missing Twitter Card tags: ${missingTwitterTags.map(([key]) => key).join(', ')}`,
      fix: 'Add Twitter Card meta tags for better social sharing',
      priority: 'medium'
    });
  }

  // Check for structured data
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  if (structuredData.length === 0) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: 'No structured data found',
      fix: 'Add JSON-LD structured data for better search visibility',
      priority: 'medium'
    });
  }

  // Check for canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: 'Missing canonical URL',
      fix: 'Add canonical link tag to prevent duplicate content issues',
      priority: 'medium'
    });
  }

  // Check for meta viewport
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    issues.push({
      type: 'error',
      category: 'meta',
      message: 'Missing viewport meta tag',
      fix: 'Add viewport meta tag for mobile responsiveness',
      priority: 'high'
    });
  }

  // Check for lang attribute
  const htmlLang = document.documentElement.getAttribute('lang');
  if (!htmlLang) {
    issues.push({
      type: 'warning',
      category: 'accessibility',
      message: 'Missing lang attribute on html element',
      fix: 'Add lang="en" to html element',
      priority: 'medium'
    });
  }

  // Check for robots meta tag
  const robots = document.querySelector('meta[name="robots"]');
  if (!robots) {
    issues.push({
      type: 'info',
      category: 'meta',
      message: 'No robots meta tag found',
      fix: 'Consider adding robots meta tag for crawling instructions',
      priority: 'low'
    });
  }

  // Performance metrics
  const performance: PerformanceMetrics = {
    imageOptimization: Math.round(((nextImages.length / Math.max(images.length, 1)) * 100)),
    metaTagsComplete: Math.round(((5 - missingOgTags.length - missingTwitterTags.length) / 5) * 100),
    structuredDataPresent: structuredData.length > 0,
    mobileOptimized: !!viewport,
    socialMediaOptimized: Math.round(((5 - missingOgTags.length) / 5) * 100)
  };

  // Generate recommendations
  if (issues.length === 0) {
    recommendations.push('Excellent! Your page follows SEO best practices.');
  } else {
    const highPriorityIssues = issues.filter(issue => issue.priority === 'high').length;
    const mediumPriorityIssues = issues.filter(issue => issue.priority === 'medium').length;

    if (highPriorityIssues > 0) {
      recommendations.push(`Fix ${highPriorityIssues} high-priority issues first.`);
    }
    if (mediumPriorityIssues > 0) {
      recommendations.push(`Address ${mediumPriorityIssues} medium-priority issues for better optimization.`);
    }

    recommendations.push('Test your page with Google\'s Rich Results Test.');
    recommendations.push('Validate structured data with Google\'s Structured Data Testing Tool.');
    recommendations.push('Check Core Web Vitals with Google PageSpeed Insights.');
    recommendations.push('Use Google Search Console to monitor search performance.');
  }

  // Calculate score
  const errorCount = issues.filter(issue => issue.type === 'error').length;
  const warningCount = issues.filter(issue => issue.type === 'warning').length;
  const infoCount = issues.filter(issue => issue.type === 'info').length;
  const score = Math.max(0, 100 - (errorCount * 15) - (warningCount * 5) - (infoCount * 1));

  return {
    score,
    issues,
    recommendations,
    performance
  };
}

// Validate structured data
export function validateStructuredData(): { isValid: boolean; errors: string[] } {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const errors: string[] = [];

  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent || '');

      // Basic validation for required fields
      if (data['@context'] !== 'https://schema.org') {
        errors.push('Missing or incorrect @context in structured data');
      }

      if (!data['@type']) {
        errors.push('Missing @type in structured data');
      }

    } catch (error) {
      errors.push(`Invalid JSON-LD structured data: ${error}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Generate comprehensive SEO report
export function generateSEOReport(): string {
  const audit = auditSEO();
  const structuredDataValidation = validateStructuredData();

  let report = `SEO Audit Report\n`;
  report += `================\n\n`;
  report += `Overall Score: ${audit.score}/100\n\n`;

  // Performance metrics
  report += `Performance Metrics:\n`;
  report += `-------------------\n`;
  report += `Image Optimization: ${audit.performance.imageOptimization}%\n`;
  report += `Meta Tags Complete: ${audit.performance.metaTagsComplete}%\n`;
  report += `Structured Data: ${audit.performance.structuredDataPresent ? 'Present' : 'Missing'}\n`;
  report += `Mobile Optimized: ${audit.performance.mobileOptimized ? 'Yes' : 'No'}\n`;
  report += `Social Media Optimized: ${audit.performance.socialMediaOptimized}%\n\n`;

  if (audit.issues.length > 0) {
    // Group issues by priority
    const highPriority = audit.issues.filter(issue => issue.priority === 'high');
    const mediumPriority = audit.issues.filter(issue => issue.priority === 'medium');
    const lowPriority = audit.issues.filter(issue => issue.priority === 'low');

    if (highPriority.length > 0) {
      report += `High Priority Issues (${highPriority.length}):\n`;
      report += `============================\n`;
      highPriority.forEach((issue, index) => {
        report += `${index + 1}. [${issue.type.toUpperCase()}] ${issue.message}\n`;
        if (issue.element) report += `   Element: "${issue.element}"\n`;
        if (issue.fix) report += `   Fix: ${issue.fix}\n`;
        report += `\n`;
      });
    }

    if (mediumPriority.length > 0) {
      report += `Medium Priority Issues (${mediumPriority.length}):\n`;
      report += `==============================\n`;
      mediumPriority.forEach((issue, index) => {
        report += `${index + 1}. [${issue.type.toUpperCase()}] ${issue.message}\n`;
        if (issue.element) report += `   Element: "${issue.element}"\n`;
        if (issue.fix) report += `   Fix: ${issue.fix}\n`;
        report += `\n`;
      });
    }

    if (lowPriority.length > 0) {
      report += `Low Priority Issues (${lowPriority.length}):\n`;
      report += `============================\n`;
      lowPriority.forEach((issue, index) => {
        report += `${index + 1}. [${issue.type.toUpperCase()}] ${issue.message}\n`;
        if (issue.element) report += `   Element: "${issue.element}"\n`;
        if (issue.fix) report += `   Fix: ${issue.fix}\n`;
        report += `\n`;
      });
    }
  }

  report += `Structured Data Validation:\n`;
  report += `---------------------------\n`;
  report += `Status: ${structuredDataValidation.isValid ? 'Valid' : 'Invalid'}\n`;
  if (structuredDataValidation.errors.length > 0) {
    report += `Errors:\n`;
    structuredDataValidation.errors.forEach((error, index) => {
      report += `${index + 1}. ${error}\n`;
    });
  }
  report += `\n`;

  report += `Recommendations:\n`;
  report += `----------------\n`;
  audit.recommendations.forEach((rec, index) => {
    report += `${index + 1}. ${rec}\n`;
  });

  return report;
}

// Performance metrics for SEO (updated to fix TypeScript errors)
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  return {
    // Core Web Vitals approximations
    fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    // Additional metrics
    ttfb: navigation.responseStart - navigation.requestStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
  };
}