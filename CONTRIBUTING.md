# Contributing to Personal Portfolio

Thank you for your interest in contributing to this personal portfolio project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun
- Git for version control
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/my-portfolio.git
   cd my-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Format code consistently (configure in your editor)
- **Naming Conventions**: Use camelCase for variables, PascalCase for components
- **File Structure**: Follow the established project structure

### Component Guidelines

1. **Functional Components**: Use functional components with hooks
2. **TypeScript Props**: Define proper TypeScript interfaces for props
3. **Accessibility**: Ensure all components are accessible (WCAG 2.1 AA)
4. **Performance**: Optimize for performance (lazy loading, memoization)
5. **Testing**: Write tests for all new components

### Example Component Structure

```typescript
// src/components/ui/ExampleComponent.tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface ExampleComponentProps {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  description,
  className,
  children
}) => {
  return (
    <div className={cn("base-styles", className)}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}

ExampleComponent.displayName = "ExampleComponent"
```

## 🧪 Testing Requirements

### Test Coverage

All contributions must include appropriate tests:

- **Unit Tests**: For individual components and utilities
- **Integration Tests**: For user interactions and workflows
- **Accessibility Tests**: For a11y compliance
- **Performance Tests**: For performance-critical features

### Writing Tests

```typescript
// src/components/ui/__tests__/ExampleComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { ExampleComponent } from '../ExampleComponent'

describe('ExampleComponent', () => {
  it('renders with title', () => {
    render(<ExampleComponent title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('is accessible', async () => {
    const { container } = render(<ExampleComponent title="Test" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test suites
npm run test:accessibility
npm run test:performance

# Generate coverage report
npm run test:coverage
```

## 🎨 Design Guidelines

### Visual Design

- **Consistency**: Follow the established design system
- **Accessibility**: Ensure proper color contrast and focus indicators
- **Responsive**: Design for mobile-first, then enhance for larger screens
- **Performance**: Optimize images and animations

### Animation Guidelines

- **Subtle**: Use subtle animations that enhance UX
- **Performance**: Use transform and opacity for smooth animations
- **Accessibility**: Respect `prefers-reduced-motion`
- **Purpose**: Animations should serve a functional purpose

### Color and Typography

- **Theme System**: Use CSS custom properties for colors
- **Contrast**: Maintain WCAG AA contrast ratios
- **Typography**: Use the established font hierarchy
- **Consistency**: Follow the design tokens

## 🚀 Performance Guidelines

### Bundle Size

- **Code Splitting**: Use dynamic imports for large components
- **Tree Shaking**: Ensure unused code is eliminated
- **Bundle Analysis**: Run `npm run analyze` to check bundle size
- **Performance Budget**: Stay within the established performance budget

### Core Web Vitals

- **LCP**: Optimize Largest Contentful Paint (< 2.5s)
- **FID**: Minimize First Input Delay (< 100ms)
- **CLS**: Prevent Cumulative Layout Shift (< 0.1)
- **FCP**: Optimize First Contentful Paint (< 1.8s)

### Performance Testing

```bash
# Run performance tests
npm run test:performance

# Run Lighthouse audit
npm run lighthouse

# Analyze bundle size
npm run analyze
```

## ♿ Accessibility Requirements

### WCAG 2.1 AA Compliance

All contributions must maintain accessibility standards:

- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Visible focus indicators
- **Alternative Text**: Descriptive alt text for images

### Accessibility Testing

```bash
# Run accessibility tests
npm run test:accessibility

# Manual testing checklist:
# - Tab through all interactive elements
# - Test with screen reader
# - Verify color contrast
# - Test keyboard-only navigation
```

## 📝 Commit Guidelines

### Commit Message Format

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `chore`: Maintenance tasks

### Examples

```bash
feat(components): add new project card component
fix(accessibility): improve keyboard navigation in header
docs(readme): update installation instructions
test(contact): add form validation tests
perf(images): optimize image loading performance
```

## 🔄 Pull Request Process

### Before Submitting

1. **Run Tests**: Ensure all tests pass
2. **Check Accessibility**: Run accessibility tests
3. **Performance Check**: Verify performance impact
4. **Code Review**: Self-review your changes
5. **Documentation**: Update documentation if needed

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Accessibility tests pass
- [ ] Performance tests pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainer reviews code
3. **Feedback**: Address any feedback or requested changes
4. **Approval**: Once approved, changes will be merged

## 🐛 Bug Reports

### Before Reporting

1. **Search Existing Issues**: Check if the bug is already reported
2. **Reproduce**: Ensure the bug is reproducible
3. **Environment**: Note your environment details

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Screenshots
If applicable, add screenshots
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other context or screenshots
```

## 📚 Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Testing Library Documentation](https://testing-library.com/)

### Tools

- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## 🤝 Community

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the project's guidelines

### Getting Help

- **Issues**: Open an issue for bugs or questions
- **Discussions**: Use GitHub Discussions for general questions
- **Documentation**: Check the README and inline comments

Thank you for contributing to this project! Your contributions help make this portfolio template better for everyone.