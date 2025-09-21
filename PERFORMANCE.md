# Performance Monitoring & Optimization

This document outlines the performance monitoring and optimization strategies implemented in the portfolio website.

## Core Web Vitals Targets

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to First Byte (TTFB)**: < 800ms

## Performance Monitoring

### Development Tools

1. **Performance Monitor** (Ctrl/Cmd + Shift + P)
   - Real-time Core Web Vitals tracking
   - Bundle size monitoring
   - Performance recommendations
   - Available in development mode

2. **Performance Checklist** (📋 button)
   - Automated performance audits
   - Best practices validation
   - Optimization recommendations

### Production Monitoring

- Google Analytics 4 integration for Web Vitals
- Service Worker for caching optimization
- Performance Observer API for real-time metrics

## Optimization Strategies

### 1. Bundle Optimization

```bash
# Analyze bundle size
npm run analyze

# View bundle composition
npm run build && npx @next/bundle-analyzer
```

**Implemented optimizations:**
- Tree shaking for unused code elimination
- Code splitting with dynamic imports
- Package optimization for framer-motion and lucide-react
- Lazy loading for non-critical components

### 2. Image Optimization

- Next.js Image component with automatic optimization
- WebP/AVIF format support
- Responsive images with proper sizing
- Lazy loading with intersection observer
- Blur placeholders for better perceived performance

### 3. Font Optimization

- Google Fonts with `font-display: swap`
- Font preloading for critical fonts
- Variable fonts for reduced file size
- Fallback fonts to prevent layout shift

### 4. Caching Strategy

**Service Worker caching:**
- Static assets: Cache-first strategy
- API responses: Network-first with fallback
- Images: Cache with fallback placeholder
- Automatic cache invalidation

**HTTP caching:**
- Static assets: 1 year cache with immutable flag
- Fonts: Long-term caching
- HTML: No cache for fresh content

### 5. Critical Resource Optimization

- DNS prefetching for external domains
- Preconnect for critical third-party resources
- Resource hints for improved loading
- Critical CSS inlining

## Performance Testing

### Automated Testing

```bash
# Run comprehensive performance test
npm run perf:test

# Quick Lighthouse audit
npm run lighthouse

# Full audit with server startup
npm run perf:audit
```

### Manual Testing

1. **Chrome DevTools**
   - Performance tab for detailed analysis
   - Network tab for resource loading
   - Lighthouse for comprehensive audits

2. **Real User Monitoring**
   - Core Web Vitals in production
   - Performance Observer API
   - Google Analytics integration

## Performance Budget

| Metric | Budget | Current | Status |
|--------|--------|---------|--------|
| Bundle Size | < 500KB | ~350KB | ✅ |
| FCP | < 1.8s | ~1.2s | ✅ |
| LCP | < 2.5s | ~1.8s | ✅ |
| CLS | < 0.1 | ~0.05 | ✅ |
| Lighthouse Score | > 90 | 95+ | ✅ |

## Monitoring Commands

```bash
# Development with performance monitoring
npm run perf:monitor

# Production build analysis
npm run analyze

# Lighthouse CI integration
npx lhci autorun

# Bundle size tracking
npm run build && ls -la .next/static/chunks/
```

## Performance Checklist

### Pre-deployment

- [ ] Run `npm run perf:test`
- [ ] Verify Core Web Vitals meet targets
- [ ] Check bundle size is under budget
- [ ] Validate image optimization
- [ ] Test on slow network conditions
- [ ] Verify service worker functionality

### Post-deployment

- [ ] Monitor real user metrics
- [ ] Set up performance alerts
- [ ] Regular Lighthouse audits
- [ ] Bundle size regression testing
- [ ] Core Web Vitals tracking

## Troubleshooting

### Common Issues

1. **High LCP**
   - Optimize hero image
   - Reduce server response time
   - Eliminate render-blocking resources

2. **High CLS**
   - Add size attributes to images
   - Reserve space for dynamic content
   - Avoid inserting content above existing content

3. **High FID/INP**
   - Reduce JavaScript execution time
   - Break up long tasks
   - Use web workers for heavy computations

4. **Large Bundle Size**
   - Implement code splitting
   - Remove unused dependencies
   - Use dynamic imports for non-critical code

### Performance Debugging

```javascript
// Enable performance logging
localStorage.setItem('debug-performance', 'true');

// View performance entries
performance.getEntriesByType('navigation');
performance.getEntriesByType('paint');
performance.getEntriesByType('largest-contentful-paint');
```

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Chrome DevTools Performance](https://developers.google.com/web/tools/chrome-devtools/performance)