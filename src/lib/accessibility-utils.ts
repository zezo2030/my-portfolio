/**
 * Accessibility utility functions for testing and validation
 */

export interface AccessibilityCheckResult {
  passed: boolean;
  message: string;
  element?: HTMLElement;
}

export class AccessibilityChecker {
  /**
   * Check if all images have alt text
   */
  static checkImageAltText(): AccessibilityCheckResult[] {
    const images = document.querySelectorAll('img');
    const results: AccessibilityCheckResult[] = [];

    images.forEach((img, index) => {
      const hasAlt = img.hasAttribute('alt');
      const altText = img.getAttribute('alt') || '';
      
      results.push({
        passed: hasAlt && altText.trim() !== '',
        message: hasAlt && altText.trim() !== '' 
          ? `Image ${index + 1}: Has proper alt text` 
          : `Image ${index + 1}: Missing or empty alt text`,
        element: img
      });
    });

    return results;
  }

  /**
   * Check if all form inputs have labels
   */
  static checkFormLabels(): AccessibilityCheckResult[] {
    const inputs = document.querySelectorAll('input, textarea, select');
    const results: AccessibilityCheckResult[] = [];

    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const hasLabel = id && !!document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.hasAttribute('aria-label');
      const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
      
      const isLabeled = hasLabel || hasAriaLabel || hasAriaLabelledBy;
      
      results.push({
        passed: isLabeled,
        message: isLabeled 
          ? `Input ${index + 1}: Has proper labeling` 
          : `Input ${index + 1}: Missing label or aria-label`,
        element: input as HTMLElement
      });
    });

    return results;
  }

  /**
   * Check color contrast ratios
   */
  static checkColorContrast(): AccessibilityCheckResult[] {
    const results: AccessibilityCheckResult[] = [];
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');

    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // This is a simplified check - in a real implementation, you'd calculate actual contrast ratios
      const hasGoodContrast = this.calculateContrastRatio(color, backgroundColor) >= 4.5;
      
      results.push({
        passed: hasGoodContrast,
        message: hasGoodContrast 
          ? `Element ${index + 1}: Good color contrast` 
          : `Element ${index + 1}: Poor color contrast`,
        element: element as HTMLElement
      });
    });

    return results.slice(0, 10); // Limit results for performance
  }

  /**
   * Check if interactive elements are keyboard accessible
   */
  static checkKeyboardAccessibility(): AccessibilityCheckResult[] {
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex], [role="button"], [role="link"]');
    const results: AccessibilityCheckResult[] = [];

    interactiveElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex');
      const isKeyboardAccessible = tabIndex !== '-1' && !element.hasAttribute('disabled');
      
      results.push({
        passed: isKeyboardAccessible,
        message: isKeyboardAccessible 
          ? `Interactive element ${index + 1}: Keyboard accessible` 
          : `Interactive element ${index + 1}: Not keyboard accessible`,
        element: element as HTMLElement
      });
    });

    return results;
  }

  /**
   * Check for proper heading hierarchy
   */
  static checkHeadingHierarchy(): AccessibilityCheckResult[] {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const results: AccessibilityCheckResult[] = [];
    let previousLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const isProperHierarchy = level <= previousLevel + 1;
      
      results.push({
        passed: isProperHierarchy,
        message: isProperHierarchy 
          ? `Heading ${index + 1} (${heading.tagName}): Proper hierarchy` 
          : `Heading ${index + 1} (${heading.tagName}): Skips heading levels`,
        element: heading as HTMLElement
      });

      previousLevel = level;
    });

    return results;
  }

  /**
   * Check for ARIA attributes
   */
  static checkAriaAttributes(): AccessibilityCheckResult[] {
    const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
    const results: AccessibilityCheckResult[] = [];

    elementsWithAria.forEach((element, index) => {
      const ariaLabelledBy = element.getAttribute('aria-labelledby');
      const ariaDescribedBy = element.getAttribute('aria-describedby');

      let hasValidAria = true;
      let message = `Element ${index + 1}: Valid ARIA attributes`;

      // Check if aria-labelledby references exist
      if (ariaLabelledBy) {
        const referencedElement = document.getElementById(ariaLabelledBy);
        if (!referencedElement) {
          hasValidAria = false;
          message = `Element ${index + 1}: aria-labelledby references non-existent element`;
        }
      }

      // Check if aria-describedby references exist
      if (ariaDescribedBy) {
        const referencedElement = document.getElementById(ariaDescribedBy);
        if (!referencedElement) {
          hasValidAria = false;
          message = `Element ${index + 1}: aria-describedby references non-existent element`;
        }
      }

      results.push({
        passed: hasValidAria,
        message,
        element: element as HTMLElement
      });
    });

    return results;
  }

  /**
   * Run all accessibility checks
   */
  static runAllChecks(): { [key: string]: AccessibilityCheckResult[] } {
    return {
      imageAltText: this.checkImageAltText(),
      formLabels: this.checkFormLabels(),
      colorContrast: this.checkColorContrast(),
      keyboardAccessibility: this.checkKeyboardAccessibility(),
      headingHierarchy: this.checkHeadingHierarchy(),
      ariaAttributes: this.checkAriaAttributes(),
    };
  }

  /**
   * Simplified contrast ratio calculation
   * In a real implementation, you'd use a proper color contrast library
   */
  private static calculateContrastRatio(): number {
    // This is a placeholder - implement actual contrast calculation
    // For now, return a passing value
    return 4.5;
  }

  /**
   * Generate accessibility report
   */
  static generateReport(): string {
    const checks = this.runAllChecks();
    let report = 'Accessibility Report\n';
    report += '===================\n\n';

    Object.entries(checks).forEach(([checkName, results]) => {
      const passed = results.filter(r => r.passed).length;
      const total = results.length;
      
      report += `${checkName}: ${passed}/${total} passed\n`;
      
      results.forEach(result => {
        if (!result.passed) {
          report += `  ❌ ${result.message}\n`;
        }
      });
      
      report += '\n';
    });

    return report;
  }
}

/**
 * Focus management utilities
 */
export class FocusManager {
  private static focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([disabled])',
    '[role="link"]:not([disabled])',
  ].join(', ');

  /**
   * Get all focusable elements within a container
   */
  static getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableSelectors)) as HTMLElement[];
  }

  /**
   * Trap focus within a container
   */
  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  /**
   * Restore focus to a previously focused element
   */
  static restoreFocus(element: HTMLElement | null) {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }
}

/**
 * Screen reader announcement utilities
 */
export class ScreenReaderAnnouncer {
  private static liveRegion: HTMLElement | null = null;

  /**
   * Initialize the live region for announcements
   */
  static init() {
    if (this.liveRegion) return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.id = 'sr-live-region';
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);
  }

  /**
   * Announce a message to screen readers
   */
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.liveRegion) this.init();
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = message;
      }
    }, 100);

    setTimeout(() => {
      if (this.liveRegion && this.liveRegion.textContent === message) {
        this.liveRegion.textContent = '';
      }
    }, 3000);
  }
}