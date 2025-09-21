"use client";

import { Button } from "./button";

export function SkipLink() {
  const handleSkipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={handleSkipToMain}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
      variant="default"
    >
      Skip to main content
    </Button>
  );
}