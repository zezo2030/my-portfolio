"use client";

import { motion } from "framer-motion";
import { Heart, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { socialLinks, contactInfo, quickLinks, professionalLinks } from "@/data/footer";
import { useResponsive } from "@/hooks";

export function Footer() {
  const { isMobile, isTablet } = useResponsive();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
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
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  const itemTransition = {
    duration: 0.6,
    ease: "easeOut"
  };

  return (
    <footer className="bg-background/95 backdrop-blur-sm border-t border-border/50 relative">
      {/* Back to top button */}
      <div className="absolute -top-6 right-4 sm:right-6 lg:right-8">
        <Button
          onClick={scrollToTop}
          size="sm"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="py-12 lg:py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Main footer content */}
          <div className={`grid gap-8 ${
            isMobile 
              ? 'grid-cols-1' 
              : isTablet 
                ? 'grid-cols-2 lg:grid-cols-4' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}>
            
            {/* Brand and description */}
            <motion.div 
              className={`${isMobile ? 'text-center' : 'lg:col-span-1'} space-y-4`}
              variants={itemVariants}
              transition={itemTransition}
            >
              <h3 className="text-2xl font-bold text-foreground">
                Portfolio
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                Passionate developer creating innovative solutions with modern technologies. 
                Let&apos;s build something amazing together.
              </p>
              
              {/* Social links */}
              <div className="flex gap-3 justify-center lg:justify-start">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg flex items-center justify-center text-muted-foreground transition-all duration-300 ${social.color} hover:border-primary/50 hover:shadow-md`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick links */}
            <motion.div 
              className={`${isMobile ? 'text-center' : ''} space-y-4`}
              variants={itemVariants}
              transition={itemTransition}
            >
              <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
              <nav className="space-y-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="block text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </button>
                ))}
              </nav>
            </motion.div>

            {/* Professional links */}
            <motion.div 
              className={`${isMobile ? 'text-center' : ''} space-y-4`}
              variants={itemVariants}
              transition={itemTransition}
            >
              <h4 className="text-lg font-semibold text-foreground">Professional</h4>
              <nav className="space-y-2">
                {professionalLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.href)}
                      className="block text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </button>
                  )
                ))}
              </nav>
            </motion.div>

            {/* Contact info */}
            <motion.div 
              className={`${isMobile ? 'text-center' : ''} space-y-4`}
              variants={itemVariants}
              transition={itemTransition}
            >
              <h4 className="text-lg font-semibold text-foreground">Get in Touch</h4>
              <div className="space-y-3">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <info.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm text-foreground hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div 
            className="my-8 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            variants={itemVariants}
            transition={itemTransition}
          />

          {/* Bottom section */}
          <motion.div 
            className={`flex ${
              isMobile 
                ? 'flex-col gap-4 text-center' 
                : 'flex-col sm:flex-row justify-between items-center gap-4'
            }`}
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} Portfolio. Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span>using Next.js & Tailwind CSS</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <button
                onClick={() => handleNavClick('#contact')}
                className="hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => handleNavClick('#contact')}
                className="hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}