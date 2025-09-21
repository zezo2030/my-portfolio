import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { Hero } from '../Hero'

// Mock hooks
vi.mock('@/hooks', () => ({
  useResponsive: () => ({
    isMobile: false,
    isTablet: false,
    isLandscape: false,
  }),
  useDeviceCapabilities: () => ({
    hasCoarsePointer: false,
  }),
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

describe('Hero', () => {
  beforeEach(() => {
    mockScrollTo.mockClear()
    mockQuerySelector.mockClear()
  })

  it('renders hero section with correct structure', () => {
    render(<Hero />)
    
    const section = screen.getByRole('banner')
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('id', 'home')
    expect(section).toHaveAttribute('itemScope')
    expect(section).toHaveAttribute('itemType', 'https://schema.org/Person')
  })

  it('displays developer name and title', () => {
    render(<Hero />)
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getByText(/Full-Stack Developer & Mobile App Specialist/)).toBeInTheDocument()
  })

  it('displays description with technology highlights', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Passionate about creating beautiful/)).toBeInTheDocument()
    expect(screen.getByText('Flutter')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
  })

  it('renders call-to-action buttons', () => {
    render(<Hero />)
    
    expect(screen.getByRole('button', { name: /view my work/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get in touch/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download.*cv/i })).toBeInTheDocument()
  })

  it('handles scroll to projects', async () => {
    const user = userEvent.setup()
    const mockElement = {
      getBoundingClientRect: () => ({ top: 1000 }),
    }
    mockQuerySelector.mockReturnValue(mockElement)
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
    
    render(<Hero />)
    
    const viewWorkButton = screen.getByRole('button', { name: /view my work/i })
    await user.click(viewWorkButton)
    
    expect(mockQuerySelector).toHaveBeenCalledWith('#projects')
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 920, // 1000 - 80 (header height)
      behavior: 'smooth',
    })
  })

  it('handles scroll to contact', async () => {
    const user = userEvent.setup()
    const mockElement = {
      getBoundingClientRect: () => ({ top: 2000 }),
    }
    mockQuerySelector.mockReturnValue(mockElement)
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
    
    render(<Hero />)
    
    const contactButton = screen.getByRole('button', { name: /get in touch/i })
    await user.click(contactButton)
    
    expect(mockQuerySelector).toHaveBeenCalledWith('#contact')
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 1920, // 2000 - 80 (header height)
      behavior: 'smooth',
    })
  })

  it('handles CV download', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()
    
    render(<Hero />)
    
    const downloadButton = screen.getByRole('button', { name: /download.*cv/i })
    await user.click(downloadButton)
    
    expect(consoleSpy).toHaveBeenCalledWith('Download resume')
    consoleSpy.mockRestore()
  })

  it('displays scroll indicator', () => {
    render(<Hero />)
    
    expect(screen.getByText(/scroll to explore/i)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Hero />)
    
    const section = screen.getByRole('banner')
    expect(section).toHaveAttribute('aria-labelledby', 'hero-heading')
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAttribute('id', 'hero-heading')
    expect(heading).toHaveAttribute('itemProp', 'name')
    
    const subtitle = screen.getByText(/Full-Stack Developer & Mobile App Specialist/)
    expect(subtitle).toHaveAttribute('itemProp', 'jobTitle')
    
    const description = screen.getByText(/Passionate about creating beautiful/)
    expect(description).toHaveAttribute('itemProp', 'description')
  })

  it('supports keyboard navigation for buttons', async () => {
    const user = userEvent.setup()
    render(<Hero />)
    
    const viewWorkButton = screen.getByRole('button', { name: /view my work/i })
    const contactButton = screen.getByRole('button', { name: /get in touch/i })
    const downloadButton = screen.getByRole('button', { name: /download.*cv/i })
    
    // Tab through buttons
    await user.tab()
    expect(viewWorkButton).toHaveFocus()
    
    await user.tab()
    expect(contactButton).toHaveFocus()
    
    await user.tab()
    expect(downloadButton).toHaveFocus()
  })

  it('renders avatar with proper styling', () => {
    render(<Hero />)
    
    // Check for avatar initials
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
})