import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReducedMotionProvider } from "@/components/animations";
import { generateMetadata as generateSEOMetadata, siteConfig } from "@/lib/metadata";
import { PerformanceMonitor } from "@/components/ui/PerformanceMonitor";
import { PerformanceInitializer } from "@/components/ui/PerformanceInitializer";
import { PerformanceChecklist } from "@/components/ui/PerformanceChecklist";
import { AccessibilityProvider, SkipLink } from "@/components/ui";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  ...generateSEOMetadata(),
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance and mobile optimization */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Additional SEO meta tags */}
        <meta name="geo.region" content="Global" />
        <meta name="geo.placename" content="Remote" />
        <meta name="ICBM" content="0.0000, 0.0000" />
        <meta name="language" content="English" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/og-image.jpg" as="image" type="image/jpeg" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PerformanceInitializer />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccessibilityProvider>
            <SkipLink />
            <ReducedMotionProvider>
              {children}
              <PerformanceMonitor />
              <PerformanceChecklist />
            </ReducedMotionProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
