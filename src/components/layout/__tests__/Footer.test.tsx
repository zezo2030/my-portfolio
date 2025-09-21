import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Footer } from '../Footer';
import { ThemeProvider } from '@/components/theme-provider';
import { ReducedMotionProvider } from '@/components/animations';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: React.ComponentProps<'a'>) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
  },
}));

// Mock hooks
vi.mock('@/hooks', () => ({
  useResponsive: () => ({
    isMobile: false,
    isTablet: false,
  }),
}));

// Mock scroll behavior
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

const renderFooter = () => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      <ReducedMotionProvider>
        <Footer />
      </ReducedMotionProvider>
    </ThemeProvider>
  );
};

describe('Footer', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
  });

  it('renders footer with brand and description', () => {
    renderFooter();
    
    expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeInTheDocument();
    expect(screen.getByText(/Passionate developer creating innovative solutions/)).toBeInTheDocument();
  });

  it('renders social links with correct attributes', () => {
    renderFooter();
    
    const githubLink = screen.getByLabelText('Visit my GitHub profile');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/johndoe');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = screen.getByLabelText('Connect with me on LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/johndoe');

    const twitterLink = screen.getByLabelText('Follow me on Twitter');
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/johndoe');

    const emailLink = screen.getByLabelText('Send me an email');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:john.developer@email.com');
  });

  it('renders quick navigation links', () => {
    renderFooter();
    
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contact' })).toBeInTheDocument();
  });

  it('renders professional links', () => {
    renderFooter();
    
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Portfolio' })).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    renderFooter();
    
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByText('john.developer@email.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('Remote / Global')).toBeInTheDocument();
  });

  it('renders copyright notice with current year', () => {
    renderFooter();
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} Portfolio`))).toBeInTheDocument();
    expect(screen.getByText('Made with')).toBeInTheDocument();
    expect(screen.getByText('using Next.js & Tailwind CSS')).toBeInTheDocument();
  });

  it('renders back to top button and handles click', () => {
    renderFooter();
    
    const backToTopButton = screen.getByLabelText('Back to top');
    expect(backToTopButton).toBeInTheDocument();
    
    fireEvent.click(backToTopButton);
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('handles navigation link clicks', () => {
    // Mock querySelector
    const mockElement = {
      getBoundingClientRect: () => ({ top: 100 }),
    };
    document.querySelector = vi.fn().mockReturnValue(mockElement);
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });

    renderFooter();
    
    const aboutLink = screen.getByRole('button', { name: 'About' });
    fireEvent.click(aboutLink);
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 20, // 100 (element top) + 0 (pageYOffset) - 80 (header height)
      behavior: 'smooth',
    });
  });

  it('renders privacy policy and terms links', () => {
    renderFooter();
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderFooter();
    
    // Check that social links have proper aria-labels
    expect(screen.getByLabelText('Visit my GitHub profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Connect with me on LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Follow me on Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Send me an email')).toBeInTheDocument();
    
    // Check back to top button
    expect(screen.getByLabelText('Back to top')).toBeInTheDocument();
  });
});