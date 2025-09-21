"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResponsive, useDeviceCapabilities } from "@/hooks";

export function Hero() {
  const { isMobile, isTablet, isLandscape } = useResponsive();
  const { hasCoarsePointer } = useDeviceCapabilities();
  const handleScrollToProjects = () => {
    const element = document.querySelector("#projects");
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

  const handleScrollToContact = () => {
    const element = document.querySelector("#contact");
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
    <section 
      id="home" 
      className={`${
        isMobile && isLandscape ? 'min-h-screen landscape-compact' : 'min-h-screen'
      } flex items-center justify-center relative overflow-hidden`}
      itemScope
      itemType="https://schema.org/Person"
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`max-w-4xl mx-auto text-center ${
          isMobile && isLandscape ? 'space-y-4' : 'space-y-8'
        }`}>
          {/* Avatar */}
          <motion.div
            className={`relative mx-auto ${
              isMobile ? 'w-24 h-24' : isTablet ? 'w-32 h-32' : 'w-40 h-40'
            } ${isMobile && isLandscape ? 'mb-4' : 'mb-8'}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <div className={`w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ${
                  isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl md:text-5xl'
                } font-bold text-primary`}>
                  JD
                </div>
              </div>
            </div>
            
            {/* Floating animation ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Main heading with animated text reveal */}
          <div className={isMobile && isLandscape ? 'space-y-2' : 'space-y-4'}>
            <motion.h1
              id="hero-heading"
              className={`${
                isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl md:text-7xl'
              } font-bold text-foreground`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              itemProp="name"
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                John
              </motion.span>{" "}
              <motion.span
                className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Developer
              </motion.span>
            </motion.h1>

            <motion.h2
              className={`${
                isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-xl md:text-2xl'
              } text-muted-foreground font-medium`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              itemProp="jobTitle"
            >
              {isMobile ? 'Full-Stack & Mobile Developer' : 'Full-Stack Developer & Mobile App Specialist'}
            </motion.h2>
          </div>

          {/* Description */}
          <motion.p
            className={`${
              isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-lg md:text-xl'
            } text-muted-foreground max-w-2xl mx-auto leading-relaxed ${
              isMobile ? 'px-4' : ''
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            itemProp="description"
          >
            {isMobile ? (
              <>
                Creating beautiful apps with{" "}
                <span className="text-primary font-semibold">Flutter</span>,{" "}
                <span className="text-primary font-semibold">React</span>, and{" "}
                <span className="text-primary font-semibold">Next.js</span>.
              </>
            ) : (
              <>
                Passionate about creating beautiful, functional applications with{" "}
                <span className="text-primary font-semibold">Flutter</span>,{" "}
                <span className="text-primary font-semibold">React</span>, and{" "}
                <span className="text-primary font-semibold">Next.js</span>. 
                Let&apos;s build something amazing together.
              </>
            )}
          </motion.p>

          {/* Call-to-action buttons */}
          <motion.div
            className={`flex ${
              isMobile ? 'flex-col gap-3' : 'flex-col sm:flex-row gap-4'
            } justify-center items-center ${
              isMobile && isLandscape ? 'pt-2 pb-12' : 'pt-4 pb-24 md:pb-32'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Button
              size={isMobile ? "default" : "lg"}
              onClick={handleScrollToProjects}
              className={`group relative overflow-hidden ${
                isMobile ? 'w-full max-w-xs' : ''
              } touch-manipulation`}
              style={{ 
                minHeight: hasCoarsePointer ? '48px' : 'auto'
              }}
              aria-label="View my projects and work"
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  aria-hidden="true"
                >
                  <ArrowDown className="w-4 h-4" />
                </motion.div>
              </span>
            </Button>

            <Button
              variant="outline"
              size={isMobile ? "default" : "lg"}
              onClick={handleScrollToContact}
              className={`group ${
                isMobile ? 'w-full max-w-xs' : ''
              } touch-manipulation`}
              style={{ 
                minHeight: hasCoarsePointer ? '48px' : 'auto'
              }}
              aria-label="Go to contact section to get in touch"
            >
              <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
              Get In Touch
            </Button>

            <Button
              variant="ghost"
              size={isMobile ? "default" : "lg"}
              className={`group ${
                isMobile ? 'w-full max-w-xs' : ''
              } touch-manipulation`}
              style={{ 
                minHeight: hasCoarsePointer ? '48px' : 'auto'
              }}
              onClick={() => {
                // This would typically download a resume PDF
                console.log("Download resume");
              }}
              aria-label="Download my CV/Resume as PDF"
            >
              <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
              Download CV
            </Button>
          </motion.div>

        </div>

      {/* Scroll indicator - hidden on mobile landscape */}
      {!(isMobile && isLandscape) && (
        <motion.div
          className={`absolute ${
            isMobile ? 'bottom-8' : 'bottom-12 md:bottom-16'
          } left-1/2 transform -translate-x-1/2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.div
            className="flex flex-col items-center text-muted-foreground cursor-pointer touch-manipulation"
            onClick={handleScrollToProjects}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ 
              minHeight: hasCoarsePointer ? '44px' : 'auto'
            }}
          >
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} mb-2`}>
              {isMobile ? 'Scroll down' : 'Scroll to explore'}
            </span>
            <ArrowDown className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </motion.div>
        </motion.div>
      )}
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </section>
  );
}