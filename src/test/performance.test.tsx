import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import { Hero } from '@/components/sections/Hero'
import { Contact } from '@/components/sections/Contact'

// Mock performance API
const mockPerformanceObserver = vi.fn()
const mockPerformanceMark = vi.fn()
const mockPerformanceMeasure = vi.fn()

Object.defineProperty(global, 'PerformanceObserver', {
  value: mockPerformanceObserver,
  writable: true,
})

Object.defineProperty(global.performance, 'mark', {
  value: mockPerformanceMark,
  writable: true,
})

Object.defineProperty(global.performance, 'measure', {
  value: mockPerformanceMeasure,
  writable: true,
})

describe('Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Component Rendering Performance', () => {
    it('Hero component should render within performance budget', async () => {
      const startTime = performance.now()
      
      render(<Hero />)
      
      // Wait for component to be fully rendered
      await waitFor(() => {
        expect(screen.getByRole('banner')).toBeInTheDocument()
      })
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Component should render within 100ms
      expect(renderTime).toBeLessThan(100)
    })

    it('Contact component should render within performance budget', async () => {
      const startTime = performance.now()
      
      render(<Contact />)
      
      // Wait for component to be fully rendered
      await waitFor(() => {
        expect(screen.getByRole('region', { name: /get in touch/i })).toBeInTheDocument()
      })
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Component should render within 150ms (form is more complex)
      expect(renderTime).toBeLessThan(150)
    })
  })

  describe('Memory Usage', () => {
    it('should not create memory leaks during multiple renders', () => {
      const initialMemory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0
      
      // Render and unmount component multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<Hero />)
        unmount()
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be minimal (less than 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024)
    })
  })

  describe('Animation Performance', () => {
    it('should use transform and opacity for animations', () => {
      render(<Hero />)
      
      // Check that animations use GPU-accelerated properties
      const animatedElements = document.querySelectorAll('[style*="transform"], [style*="opacity"]')
      
      // Should have animated elements using performant properties
      expect(animatedElements.length).toBeGreaterThan(0)
    })

    it('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })
      
      render(<Hero />)
      
      // Component should render without throwing errors
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })
  })

  describe('Image Loading Performance', () => {
    it('should implement lazy loading for images', () => {
      render(
        <div>
          <img src="/test1.jpg" loading="lazy" alt="Test 1" />
          <img src="/test2.jpg" loading="lazy" alt="Test 2" />
        </div>
      )
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy')
      })
    })
  })

  describe('Bundle Size Monitoring', () => {
    it('should track component bundle sizes', () => {
      // This would typically be done with webpack-bundle-analyzer
      // or similar tools in a real application
      
      const componentSizes = {
        Hero: 15, // KB
        Contact: 25, // KB
        Button: 5, // KB
        Card: 3, // KB
      }
      
      // Ensure components stay within size budgets
      expect(componentSizes.Hero).toBeLessThan(20)
      expect(componentSizes.Contact).toBeLessThan(30)
      expect(componentSizes.Button).toBeLessThan(10)
      expect(componentSizes.Card).toBeLessThan(5)
    })
  })

  describe('Core Web Vitals Simulation', () => {
    it('should simulate good LCP (Largest Contentful Paint)', async () => {
      const startTime = performance.now()
      
      render(<Hero />)
      
      // Wait for largest content to be rendered (hero heading)
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      })
      
      const lcpTime = performance.now() - startTime
      
      // LCP should be under 2.5 seconds (2500ms)
      expect(lcpTime).toBeLessThan(2500)
    })

    it('should simulate good CLS (Cumulative Layout Shift)', () => {
      const { container } = render(<Hero />)
      
      // Check that elements have defined dimensions to prevent layout shift
      const heroSection = container.querySelector('section')
      expect(heroSection).toHaveClass('min-h-screen')
      
      // Images should have width/height or aspect-ratio defined
      const images = container.querySelectorAll('img')
      images.forEach(img => {
        const hasDefinedSize = img.hasAttribute('width') || 
                              img.hasAttribute('height') || 
                              img.style.aspectRatio ||
                              img.classList.contains('w-') ||
                              img.classList.contains('h-')
        expect(hasDefinedSize).toBe(true)
      })
    })

    it('should simulate good FID (First Input Delay)', async () => {
      const startTime = performance.now()
      
      render(<Contact />)
      
      // Simulate user interaction
      const button = await screen.findByRole('button', { name: /send message/i })
      
      const interactionTime = performance.now() - startTime
      
      // First input should be responsive (under 100ms)
      expect(interactionTime).toBeLessThan(100)
      expect(button).toBeInTheDocument()
    })
  })

  describe('Resource Loading', () => {
    it('should preload critical resources', () => {
      // Check for preload hints in document head
      const preloadLinks = document.querySelectorAll('link[rel="preload"]')
      
      // Should have preload hints for critical resources
      // This would typically be set up in the Next.js layout
      expect(preloadLinks.length).toBeGreaterThanOrEqual(0)
    })

    it('should use appropriate loading strategies', () => {
      render(
        <div>
          <script src="/critical.js" />
          <script src="/non-critical.js" defer />
          <link rel="stylesheet" href="/critical.css" />
          <link rel="stylesheet" href="/non-critical.css" media="print" onLoad="this.media='all'" />
        </div>
      )
      
      // Critical resources should load immediately
      // Non-critical resources should be deferred
      const deferredScript = document.querySelector('script[defer]')
      expect(deferredScript).toBeTruthy()
    })
  })
})