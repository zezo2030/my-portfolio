import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default styles', () => {
      render(<Card data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card')
    })

    it('applies custom className', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('custom-class')
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      render(<Card ref={ref}>Content</Card>)
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('CardHeader', () => {
    it('renders with correct styles', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>)
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })
  })

  describe('CardTitle', () => {
    it('renders as h3 by default', () => {
      render(<CardTitle>Title</CardTitle>)
      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('text-2xl', 'font-semibold')
    })
  })

  describe('CardDescription', () => {
    it('renders with muted text color', () => {
      render(<CardDescription data-testid="description">Description</CardDescription>)
      const description = screen.getByTestId('description')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('renders with padding', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('p-6', 'pt-0')
    })
  })

  describe('CardFooter', () => {
    it('renders with flex layout', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>)
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })
  })

  describe('Complete Card', () => {
    it('renders all card components together', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByTestId('complete-card')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /card title/i })).toBeInTheDocument()
      expect(screen.getByText(/card description/i)).toBeInTheDocument()
      expect(screen.getByText(/card content goes here/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
    })
  })
})