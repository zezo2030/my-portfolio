"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { navigationItems } from "@/data/navigation";
import { useActiveSection, useResponsive, useDeviceCapabilities } from "@/hooks";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const activeSection = useActiveSection();
  const { isMobile, isTablet, isLandscape } = useResponsive();
  const { supportsTouch, hasCoarsePointer } = useDeviceCapabilities();

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when screen size changes or orientation changes
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  // Handle touch events for better mobile interaction
  useEffect(() => {
    if (isMenuOpen && supportsTouch) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMenuOpen, supportsTouch]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    
    // Smooth scroll to section with responsive header height
    const element = document.querySelector(href);
    if (element) {
      const headerHeight = isMobile ? 70 : isTablet ? 75 : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/50"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${
            isMobile ? 'h-16' : isTablet ? 'h-18' : 'h-20'
          }`}>
            {/* Logo */}
            <motion.button
              className={`${
                isMobile ? 'text-xl' : 'text-2xl'
              } font-bold text-foreground cursor-pointer select-none bg-transparent border-none p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
              onClick={() => handleNavClick("#home")}
              whileHover={!hasCoarsePointer ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              style={{ 
                minHeight: hasCoarsePointer ? '44px' : 'auto',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Go to home section"
            >
              Portfolio
            </motion.button>

            {/* Desktop Navigation */}
            <nav 
              className={`hidden md:flex items-center ${
                isTablet ? 'space-x-6' : 'space-x-8'
              }`}
              role="navigation"
              aria-label="Main navigation"
            >
              {navigationItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    activeSection === item.href.slice(1)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground focus:text-foreground"
                  }`}
                  whileHover={!hasCoarsePointer ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  aria-label={item.label}
                  aria-current={activeSection === item.href.slice(1) ? "page" : undefined}
                >
                  {item.name}
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeSection"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      aria-hidden="true"
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Desktop Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${hasCoarsePointer ? 'p-3' : 'p-2'} touch-manipulation`}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              id="mobile-menu"
              className={`fixed ${
                isMobile ? 'top-16' : 'top-18'
              } right-0 bottom-0 ${
                isMobile && isLandscape ? 'w-64' : 'w-80'
              } max-w-[85vw] bg-background/95 backdrop-blur-md border-l border-border z-50 md:hidden`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                mass: 0.8
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <nav 
                className={`flex flex-col ${
                  isMobile && isLandscape ? 'p-4 space-y-4' : 'p-6 space-y-6'
                } overflow-y-auto`}
                role="navigation"
                aria-label="Mobile navigation"
              >
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-left ${
                      isMobile && isLandscape ? 'text-base' : 'text-lg'
                    } font-medium transition-colors duration-200 rounded-md px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      activeSection === item.href.slice(1)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground focus:text-foreground"
                    } touch-manipulation`}
                    style={{ 
                      minHeight: hasCoarsePointer ? '48px' : '44px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    aria-label={item.label}
                    aria-current={activeSection === item.href.slice(1) ? "page" : undefined}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}