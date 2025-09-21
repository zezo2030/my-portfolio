"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, MobileOptimized, DeviceRotationHandler, SafeAreaProvider, AccessibilityTester } from "@/components/ui";
import { Header, Footer } from "@/components/layout";
import { Hero, About, Skills, Projects, Contact } from "@/components/sections";
import { MultipleStructuredData, SEOChecklist } from "@/components/seo";
import { usePerformanceMonitor, useResponsive } from "@/hooks";
import { 
  generatePersonStructuredData, 
  generateWebsiteStructuredData,
  generatePortfolioStructuredData,
  generateOrganizationStructuredData,
  generateBreadcrumbStructuredData 
} from "@/lib/metadata";

export default function Home() {
  // Monitor performance metrics
  usePerformanceMonitor();
  const { isMobile, isTablet } = useResponsive();

  // Generate structured data
  const structuredDataArray = [
    generatePersonStructuredData(),
    generateWebsiteStructuredData(),
    generatePortfolioStructuredData(),
    generateOrganizationStructuredData(),
    generateBreadcrumbStructuredData([
      { name: 'Home', url: '/' },
      { name: 'About', url: '/#about' },
      { name: 'Skills', url: '/#skills' },
      { name: 'Projects', url: '/#projects' },
      { name: 'Contact', url: '/#contact' },
    ])
  ];

  return (
    <SafeAreaProvider>
      <div className="min-h-screen bg-background">
        {/* Structured Data for SEO */}
        <MultipleStructuredData dataArray={structuredDataArray} />
        
        <DeviceRotationHandler />
        <Header />

      <main 
        id="main-content"
        className={`${
          isMobile ? 'pt-16' : isTablet ? 'pt-18' : 'pt-20'
        }`}
        tabIndex={-1}
      >
        {/* Hero section */}
        <Hero />

        {/* About section */}
        <MobileOptimized enableLazyLoading={isMobile}>
          <About />
        </MobileOptimized>

        {/* Skills section */}
        <MobileOptimized enableLazyLoading={isMobile}>
          <Skills />
        </MobileOptimized>

        {/* Projects section */}
        <MobileOptimized enableLazyLoading={isMobile}>
          <Projects />
        </MobileOptimized>

        {/* Contact section */}
        <MobileOptimized enableLazyLoading={isMobile}>
          <Contact />
        </MobileOptimized>

        {/* Component showcase section - hidden on mobile for performance */}
        {!isMobile && (
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto space-y-8">
                <h3 className="text-2xl font-semibold text-center">Component Showcase</h3>
                
                <div className={`grid ${
                  isTablet ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                }`}>
                <Card>
                  <CardHeader>
                    <CardTitle>Navigation System</CardTitle>
                    <CardDescription>
                      Responsive navigation with smooth scrolling and active section highlighting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      The navigation automatically highlights the current section and provides smooth scrolling between sections.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mobile Menu</CardTitle>
                    <CardDescription>
                      Slide-out hamburger menu with animations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      On mobile devices, the navigation transforms into a hamburger menu with smooth slide animations.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Theme Toggle</CardTitle>
                    <CardDescription>
                      Dark/light mode with smooth transitions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Toggle between dark and light themes with smooth icon transitions and color changes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        )}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* SEO Checklist for development */}
      <SEOChecklist />
      
      {/* Accessibility Tester for development */}
      <AccessibilityTester />
      </div>
    </SafeAreaProvider>
  );
}