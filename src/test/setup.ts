import '@testing-library/jest-dom'
import React from 'react'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: React.ComponentProps<'img'>) => {
    return React.createElement('img', { src, alt, ...props })
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => React.createElement('div', props, children),
    section: ({ children, ...props }: React.ComponentProps<'section'>) => React.createElement('section', props, children),
    h1: ({ children, ...props }: React.ComponentProps<'h1'>) => React.createElement('h1', props, children),
    h2: ({ children, ...props }: React.ComponentProps<'h2'>) => React.createElement('h2', props, children),
    p: ({ children, ...props }: React.ComponentProps<'p'>) => React.createElement('p', props, children),
    button: ({ children, ...props }: React.ComponentProps<'button'>) => React.createElement('button', props, children),
    a: ({ children, ...props }: React.ComponentProps<'a'>) => React.createElement('a', props, children),
    span: ({ children, ...props }: React.ComponentProps<'span'>) => React.createElement('span', props, children),
    ul: ({ children, ...props }: React.ComponentProps<'ul'>) => React.createElement('ul', props, children),
    li: ({ children, ...props }: React.ComponentProps<'li'>) => React.createElement('li', props, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => [vi.fn(), true],
}))

// Mock Intersection Observer
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})