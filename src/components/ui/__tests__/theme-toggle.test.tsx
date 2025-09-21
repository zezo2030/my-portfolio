import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../theme-toggle'

// Mock next-themes
const mockSetTheme = vi.fn()
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('renders loading state initially', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })

  it('renders theme toggle button after mounting', async () => {
    render(<ThemeToggle />)
    
    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
      expect(button).toHaveAttribute('title', 'Switch to dark mode')
    })
  })

  it('displays sun and moon icons', async () => {
    render(<ThemeToggle />)
    
    await waitFor(() => {
      // Icons are rendered but one is hidden via CSS classes
      const icons = screen.getAllByRole('img', { hidden: true })
      expect(icons).toHaveLength(2)
    })
  })

  it('toggles theme when clicked', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    
    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled()
    })
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('has proper accessibility attributes', async () => {
    render(<ThemeToggle />)
    
    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label')
      expect(button).toHaveAttribute('title')
      expect(screen.getByText(/switch to.*mode/i)).toBeInTheDocument()
    })
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    
    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled()
    })
    
    const button = screen.getByRole('button')
    button.focus()
    expect(button).toHaveFocus()
    
    await user.keyboard('{Enter}')
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})