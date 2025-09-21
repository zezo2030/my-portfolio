import { describe, it, expect } from 'vitest'
import { render } from '@/test/utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Hero } from '@/components/sections/Hero'
import { Contact } from '@/components/sections/Contact'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  describe('UI Components', () => {
    it('Button component should not have accessibility violations', async () => {
      const { container } = render(
        <div>
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Card component should not have accessibility violations', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card content with proper semantic structure.</p>
          </CardContent>
        </Card>
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('ThemeToggle component should not have accessibility violations', async () => {
      const { container } = render(<ThemeToggle />)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Section Components', () => {
    it('Hero section should not have accessibility violations', async () => {
      const { container } = render(<Hero />)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Contact section should not have accessibility violations', async () => {
      const { container } = render(<Contact />)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Form Accessibility', () => {
    it('Contact form should have proper labels and ARIA attributes', async () => {
      const { container } = render(<Contact />)
      
      // Run axe with form-specific rules
      const results = await axe(container, {
        rules: {
          'label': { enabled: true },
          'aria-required-attr': { enabled: true },
          'aria-valid-attr': { enabled: true },
          'form-field-multiple-labels': { enabled: true },
        }
      })
      
      expect(results).toHaveNoViolations()
    })
  })

  describe('Color Contrast', () => {
    it('should meet WCAG AA color contrast requirements', async () => {
      const { container } = render(
        <div>
          <h1 className="text-foreground">Main Heading</h1>
          <p className="text-muted-foreground">Secondary text content</p>
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>
      )
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        }
      })
      
      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation', () => {
    it('interactive elements should be keyboard accessible', async () => {
      const { container } = render(
        <div>
          <Button>Focusable Button</Button>
          <a href="#test">Focusable Link</a>
          <input type="text" aria-label="Test input" />
          <button type="button">Another Button</button>
        </div>
      )
      
      const results = await axe(container, {
        rules: {
          'focusable-content': { enabled: true },
          'focus-order-semantics': { enabled: true },
        }
      })
      
      expect(results).toHaveNoViolations()
    })
  })

  describe('Semantic HTML', () => {
    it('should use proper semantic HTML structure', async () => {
      const { container } = render(
        <main>
          <section aria-labelledby="hero-heading">
            <h1 id="hero-heading">Page Title</h1>
            <p>Page description</p>
          </section>
          <nav aria-label="Main navigation">
            <ul>
              <li><a href="#section1">Section 1</a></li>
              <li><a href="#section2">Section 2</a></li>
            </ul>
          </nav>
        </main>
      )
      
      const results = await axe(container, {
        rules: {
          'landmark-one-main': { enabled: true },
          'page-has-heading-one': { enabled: true },
          'region': { enabled: true },
        }
      })
      
      expect(results).toHaveNoViolations()
    })
  })

  describe('Images and Media', () => {
    it('images should have proper alt text', async () => {
      const { container } = render(
        <div>
          <img src="/test.jpg" alt="Descriptive alt text for test image" />
          <img src="/decorative.jpg" alt="" role="presentation" />
        </div>
      )
      
      const results = await axe(container, {
        rules: {
          'image-alt': { enabled: true },
        }
      })
      
      expect(results).toHaveNoViolations()
    })
  })

  describe('ARIA Usage', () => {
    it('should use ARIA attributes correctly', async () => {
      const { container } = render(
        <div>
          <button aria-expanded="false" aria-controls="menu">Menu</button>
          <div id="menu" role="menu" aria-hidden="true">
            <div role="menuitem">Item 1</div>
            <div role="menuitem">Item 2</div>
          </div>
          <div role="alert" aria-live="polite">Status message</div>
        </div>
      )
      
      const results = await axe(container, {
        rules: {
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
          'aria-required-children': { enabled: true },
          'aria-required-parent': { enabled: true },
        }
      })
      
      expect(results).toHaveNoViolations()
    })
  })
})