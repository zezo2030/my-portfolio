"use client";

import { useEffect, useCallback } from "react";

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean;
  enableTabTrapping?: boolean;
  enableEscapeKey?: boolean;
  onEscape?: () => void;
  containerRef?: React.RefObject<HTMLElement>;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableArrowKeys = false,
    enableTabTrapping = false,
    enableEscapeKey = false,
    onEscape,
    containerRef,
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Handle escape key
    if (enableEscapeKey && event.key === 'Escape') {
      event.preventDefault();
      onEscape?.();
      return;
    }

    // Handle arrow key navigation
    if (enableArrowKeys && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const focusableElements = getFocusableElements(containerRef?.current || document);
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
      
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % focusableElements.length;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
          break;
      }

      event.preventDefault();
      focusableElements[nextIndex]?.focus();
    }

    // Handle tab trapping
    if (enableTabTrapping && event.key === 'Tab' && containerRef?.current) {
      const focusableElements = getFocusableElements(containerRef.current);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

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
    }
  }, [enableArrowKeys, enableTabTrapping, enableEscapeKey, onEscape, containerRef]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    focusFirst: () => {
      const focusableElements = getFocusableElements(containerRef?.current || document);
      focusableElements[0]?.focus();
    },
    focusLast: () => {
      const focusableElements = getFocusableElements(containerRef?.current || document);
      focusableElements[focusableElements.length - 1]?.focus();
    },
  };
}

function getFocusableElements(container: HTMLElement | Document): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([disabled])',
    '[role="link"]:not([disabled])',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
}