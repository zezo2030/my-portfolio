import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { Header } from '../Header'

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

// Mock navigation data
vi.mock('@/data/navigation', () => ({
  navigationItems: [
    { name: 'Home', href: '#home', label: 'Go to home section' },
    { name: 'About', href: '#about', label: 'Go to about section' },
    { name: 'Skills', href: '#skills', label: 'Go to skills section' },
    { name: 'Projects', href: '#projects', label: 'Go to projects section' },
    { name: 'Contact', href: '#contact', label: 'Go to contact section' },
  ],
}))

// Mock scrollTo
const mockScrollTo = vi.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

// Mock querySelector
const mockQuerySelector = vi.fn()
Object.defineProperty(document, 'querySelector', {
  value: mockQuerySelector,
  writable: true,
})

describe('Header', () => {
  beforeEach(() => {
    mockScrollTo.mockClear()
    mockQuerySelector.mockClear()
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  it('renders header with logo and navigation', () => {
    render(<Header />)
    
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to home section/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
  })

  it('displays all navigation items', () => {
    render(<Header />)
    
    expect(screen.getByRole('button', { name: /go to home section/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to about section/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to skills section/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to projects section/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to contact section/i })).toBeInTheDocument()
  })

  it('highlights active section', () => {
    render(<Header />)
    
    const homeButton = screen.getByRole('button', { name: /go to home section/i })
    expect(homeButton).toHaveAttribute('aria-current', 'page')
  })

  it('handles navigation clicks', async () => {
    const user = userEvent.setup()
    const mockElement = {
      getBoundingClientRect: () => ({ top: 1000 }),
    }
    mockQuerySelector.mockReturnValue(mockElement)
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
    
    render(<Header />)
    
    const aboutButton = screen.getByRole('button', { name: /go to about section/i })
    await user.click(aboutButton)
    
    expect(mockQuerySelector).toHaveBeenCalledWith('#about')
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 920, // 1000 - 80 (header height)
      behavior: 'smooth',
    })
  })

  it('shows theme toggle', () => {
    render(<Header />)
    
    // Theme toggle should be present (mocked in setup)
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('applies scrolled styles when scrolled', async () => {
    render(<Header />)
    
    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    window.dispatchEvent(new Event('scroll'))
    
    await waitFor(() => {
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('bg-background/80')
    })
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Header />)
    
    // Tab through navigation items
    await user.tab()
    expect(screen.getByRole('button', { name: /go to home section/i })).toHaveFocus()
    
    await user.tab()
    expect(screen.getByRole('button', { name: /go to about section/i })).toHaveFocus()
  })

  it('handles logo click to navigate home', async () => {
    const user = userEvent.setup()
    const mockElement = {
      getBoundingClientRect: () => ({ top: 0 }),
    }
    mockQuerySelector.mockReturnValue(mockElement)
    
    render(<Header />)
    
    const logo = screen.getByRole('button', { name: /go to home section/i })
    await user.click(logo)
    
    expect(mockQuerySelector).toHaveBeenCalledWith('#home')
    expect(mockScrollTo).toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<Header />)
    
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(nav).toBeInTheDocument()
    
    const homeButton = screen.getByRole('button', { name: /go to home section/i })
    expect(homeButton).toHaveAttribute('aria-label', 'Go to home section')
  })
})