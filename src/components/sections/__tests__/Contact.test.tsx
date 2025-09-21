import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { Contact } from '../Contact'

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders contact section with correct structure', () => {
    render(<Contact />)
    
    const section = screen.getByRole('region', { name: /get in touch/i })
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('id', 'contact')
    expect(section).toHaveAttribute('aria-labelledby', 'contact-heading')
  })

  it('displays section heading and description', () => {
    render(<Contact />)
    
    expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument()
    expect(screen.getByText(/ready to bring your ideas to life/i)).toBeInTheDocument()
  })

  it('displays contact information', () => {
    render(<Contact />)
    
    expect(screen.getByText('john.developer@email.com')).toBeInTheDocument()
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument()
    expect(screen.getByText('Remote / Global')).toBeInTheDocument()
  })

  it('displays social media links', () => {
    render(<Contact />)
    
    const githubLink = screen.getByRole('link', { name: /github/i })
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
    const twitterLink = screen.getByRole('link', { name: /twitter/i })
    
    expect(githubLink).toHaveAttribute('href', 'https://github.com/johndoe')
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/johndoe')
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/johndoe')
    
    // Check for external link attributes
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders contact form with all fields', () => {
    render(<Contact />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/subject must be at least 5 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('validates field lengths', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    
    // Test minimum lengths
    await user.type(screen.getByLabelText(/name/i), 'A')
    await user.type(screen.getByLabelText(/subject/i), 'Hi')
    await user.type(screen.getByLabelText(/message/i), 'Short')
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/subject must be at least 5 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<Contact />)
    
    // Fill out form with valid data
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters.')
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    // Check loading state
    expect(screen.getByText(/sending.../i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message with enough characters.'
    })
    
    consoleSpy.mockRestore()
  })

  it('clears form after successful submission', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    
    // Fill out form
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const subjectInput = screen.getByLabelText(/subject/i)
    const messageInput = screen.getByLabelText(/message/i)
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(subjectInput, 'Test Subject')
    await user.type(messageInput, 'This is a test message.')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    // Wait for success and check form is cleared
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    expect(nameInput).toHaveValue('')
    expect(emailInput).toHaveValue('')
    expect(subjectInput).toHaveValue('')
    expect(messageInput).toHaveValue('')
  })

  it('has proper accessibility attributes', () => {
    render(<Contact />)
    
    // Check form labels
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const subjectInput = screen.getByLabelText(/subject/i)
    const messageInput = screen.getByLabelText(/message/i)
    
    expect(nameInput).toHaveAttribute('aria-required', 'true')
    expect(emailInput).toHaveAttribute('aria-required', 'true')
    expect(subjectInput).toHaveAttribute('aria-required', 'true')
    expect(messageInput).toHaveAttribute('aria-required', 'true')
    
    expect(emailInput).toHaveAttribute('autoComplete', 'email')
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    
    // Tab through form fields
    await user.tab()
    expect(screen.getByLabelText(/name/i)).toHaveFocus()
    
    await user.tab()
    expect(screen.getByLabelText(/email/i)).toHaveFocus()
    
    await user.tab()
    expect(screen.getByLabelText(/subject/i)).toHaveFocus()
    
    await user.tab()
    expect(screen.getByLabelText(/message/i)).toHaveFocus()
    
    await user.tab()
    expect(screen.getByRole('button', { name: /send message/i })).toHaveFocus()
  })

  it('displays error state on form submission failure', async () => {
    // Mock console.error to simulate failure
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock a rejection in the form submission
    vi.spyOn(global, 'setTimeout').mockImplementation((_callback: TimerHandler) => {
      throw new Error('Network error')
    })
    
    const user = userEvent.setup()
    render(<Contact />)
    
    // Fill out form with valid data
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message.')
    
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
    })
    
    consoleErrorSpy.mockRestore()
    vi.restoreAllMocks()
  })
})