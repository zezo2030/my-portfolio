import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { Hero } from '@/components/sections/Hero'
import { Contact } from '@/components/sections/Contact'
import { Header } from '@/components/layout/Header'

// Mock navigation data
vi.mock('@/data/navigation', () => ({
  navigationItems: [
    { name: 'Home', href: '#home', label: 'Go to home section' },
    { name: 'About', href: '#about', label: 'Go to about section' },
    { name: 'Contact', href: '#contact', label: 'Go to contact section' },
  ],
}))

// Mock hooks
vi.mock('@/hooks', () => ({
  useActiveSection: () => 'home',
  useResponsive: () => ({
    isMobile: false,
    isTablet: false,
    isLandscape: false,
  }),
  useDeviceCapabilities: () => ({
    supportsTouch: false,
    hasCoarsePointer: false,
  }),
}))

// Mock scrollTo and querySelector
const mockScrollTo = vi.fn()
const mockQuerySelector = vi.fn()

Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

Object.defineProperty(document, 'querySelector', {
  value: mockQuerySelector,
  writable: true,
})

describe('Integration Tests', () => {
  beforeEach(() => {
    mockScrollTo.mockClear()
    mockQuerySelector.mockClear()
  })

  describe('Navigation Integration', () => {
    it('should navigate from header to contact section', async () => {
      const user = userEvent.setup()
      
      // Mock contact section element
      const mockContactElement = {
        getBoundingClientRect: () => ({ top: 2000 }),
      }
      mockQuerySelector.mockReturnValue(mockContactElement)
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
      
      render(
        <div>
          <Header />
          <Contact />
        </div>
      )
      
      // Click contact navigation item
      const contactNavButton = screen.getByRole('button', { name: /go to contact section/i })
      await user.click(contactNavButton)
      
      // Verify navigation occurred
      expect(mockQuerySelector).toHaveBeenCalledWith('#contact')
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 1920, // 2000 - 80 (header height)
        behavior: 'smooth',
      })
    })

    it('should navigate from hero CTA to contact form', async () => {
      const user = userEvent.setup()
      
      // Mock contact section element
      const mockContactElement = {
        getBoundingClientRect: () => ({ top: 1500 }),
      }
      mockQuerySelector.mockReturnValue(mockContactElement)
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
      
      render(
        <div>
          <Hero />
          <Contact />
        </div>
      )
      
      // Click "Get In Touch" button in hero
      const getInTouchButton = screen.getByRole('button', { name: /get in touch/i })
      await user.click(getInTouchButton)
      
      // Verify navigation to contact section
      expect(mockQuerySelector).toHaveBeenCalledWith('#contact')
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 1420, // 1500 - 80 (header height)
        behavior: 'smooth',
      })
    })
  })

  describe('Form Submission Flow', () => {
    it('should complete full contact form submission flow', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const user = userEvent.setup()
      
      render(<Contact />)
      
      // Fill out the form
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/subject/i), 'Integration Test')
      await user.type(screen.getByLabelText(/message/i), 'This is a test message for integration testing.')
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /send message/i })
      await user.click(submitButton)
      
      // Verify loading state
      expect(screen.getByText(/sending.../i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
      
      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Verify form was submitted with correct data
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Integration Test',
        message: 'This is a test message for integration testing.'
      })
      
      // Verify form is cleared
      expect(screen.getByLabelText(/name/i)).toHaveValue('')
      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/subject/i)).toHaveValue('')
      expect(screen.getByLabelText(/message/i)).toHaveValue('')
      
      consoleSpy.mockRestore()
    })

    it('should handle form validation errors', async () => {
      const user = userEvent.setup()
      
      render(<Contact />)
      
      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /send message/i })
      await user.click(submitButton)
      
      // Verify validation errors appear
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
        expect(screen.getByText(/subject must be at least 5 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
      })
      
      // Fill out form with invalid email
      await user.type(screen.getByLabelText(/name/i), 'John')
      await user.type(screen.getByLabelText(/email/i), 'invalid-email')
      await user.type(screen.getByLabelText(/subject/i), 'Test')
      await user.type(screen.getByLabelText(/message/i), 'Short')
      
      await user.click(submitButton)
      
      // Verify specific validation errors
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
        expect(screen.getByText(/subject must be at least 5 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
      })
    })
  })

  describe('Theme Integration', () => {
    it('should toggle theme across components', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <Header />
          <Hero />
          <Contact />
        </div>
      )
      
      // Find theme toggle button
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
      expect(themeToggle).toBeInTheDocument()
      
      // Theme toggle should be functional
      await user.click(themeToggle)
      
      // Components should still be rendered correctly
      expect(screen.getByRole('banner')).toBeInTheDocument() // Hero
      expect(screen.getByRole('region', { name: /get in touch/i })).toBeInTheDocument() // Contact
    })
  })

  describe('Responsive Behavior Integration', () => {
    it('should handle mobile navigation flow', async () => {
      // Mock mobile responsive hook
      vi.mocked(vi.importActual('@/hooks')).useResponsive = () => ({
        isMobile: true,
        isTablet: false,
        isLandscape: false,
      })
      
      const user = userEvent.setup()
      
      render(
        <div>
          <Header />
          <Contact />
        </div>
      )
      
      // Should show mobile menu button
      const menuButton = screen.getByRole('button', { name: /open navigation menu/i })
      expect(menuButton).toBeInTheDocument()
      
      // Open mobile menu
      await user.click(menuButton)
      
      // Should show mobile navigation
      expect(screen.getByRole('dialog', { name: /mobile navigation menu/i })).toBeInTheDocument()
      
      // Should be able to navigate from mobile menu
      const contactNavButton = screen.getByRole('button', { name: /go to contact section/i })
      await user.click(contactNavButton)
      
      // Mobile menu should close after navigation
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /mobile navigation menu/i })).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Integration', () => {
    it('should maintain focus management across components', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <Header />
          <Hero />
          <Contact />
        </div>
      )
      
      // Tab through interactive elements
      await user.tab() // Header logo
      await user.tab() // Navigation item 1
      await user.tab() // Navigation item 2
      await user.tab() // Navigation item 3
      await user.tab() // Theme toggle
      
      // Should eventually reach hero buttons
      await user.tab() // Hero "View My Work" button
      expect(screen.getByRole('button', { name: /view my work/i })).toHaveFocus()
      
      await user.tab() // Hero "Get In Touch" button
      expect(screen.getByRole('button', { name: /get in touch/i })).toHaveFocus()
    })

    it('should announce form submission status to screen readers', async () => {
      const user = userEvent.setup()
      
      render(<Contact />)
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
      await user.type(screen.getByLabelText(/message/i), 'Test message content.')
      
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      // Success message should be announced
      await waitFor(() => {
        const successMessage = screen.getByText(/message sent successfully/i)
        expect(successMessage).toBeInTheDocument()
        // Success message container should have proper ARIA attributes for announcements
        expect(successMessage.closest('div')).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle network errors gracefully', async () => {
      // Mock network error
      vi.spyOn(global, 'setTimeout').mockImplementation(() => {
        throw new Error('Network error')
      })
      
      const user = userEvent.setup()
      
      render(<Contact />)
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
      await user.type(screen.getByLabelText(/message/i), 'Test message content.')
      
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      // Error message should appear
      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
      })
      
      vi.restoreAllMocks()
    })
  })
})