import { Metadata } from 'next';

// Site configuration
export const siteConfig = {
  name: "John Developer - Full-Stack Developer Portfolio",
  title: "John Developer | Full-Stack Developer & Mobile App Specialist",
  description: "Passionate full-stack developer specializing in Flutter, React, Next.js, and modern web technologies. Creating beautiful, functional applications with exceptional user experiences.",
  url: "https://johndeveloper.dev", // Replace with actual domain
  ogImage: "/og-image.jpg",
  author: {
    name: "John Developer",
    email: "john.developer@email.com",
    twitter: "@johndoe",
    github: "johndoe",
    linkedin: "johndoe"
  },
  keywords: [
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Flutter Developer",
    "Mobile App Developer",
    "TypeScript",
    "JavaScript",
    "Web Development",
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Developer",
    "Portfolio",
    "Software Engineer"
  ]
};

// Generate metadata for different pages
export function generateMetadata(
  title?: string,
  description?: string,
  image?: string,
  noIndex?: boolean
): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;

  return {
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: metaDescription,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.author.twitter,
      site: siteConfig.author.twitter,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#3b82f6',
        },
      ],
    },
    manifest: '/site.webmanifest',
    alternates: {
      canonical: siteConfig.url,
    },
    verification: {
      google: 'your-google-verification-code', // Replace with actual verification code
      yandex: 'your-yandex-verification-code', // Replace with actual verification code
      yahoo: 'your-yahoo-verification-code', // Replace with actual verification code
    },
    category: 'technology',
  };
}

// Structured data for JSON-LD
export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/profile-image.jpg`,
    sameAs: [
      `https://twitter.com/${siteConfig.author.twitter.replace('@', '')}`,
      `https://github.com/${siteConfig.author.github}`,
      `https://linkedin.com/in/${siteConfig.author.linkedin}`,
    ],
    jobTitle: 'Full-Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Flutter',
      'Dart',
      'Node.js',
      'Web Development',
      'Mobile Development',
      'UI/UX Design',
    ],
    email: siteConfig.author.email,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Remote',
      addressCountry: 'Global'
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Self-taught Developer'
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Full-Stack Developer',
      occupationLocation: {
        '@type': 'Place',
        name: 'Remote'
      },
      skills: [
        'React',
        'Next.js',
        'Flutter',
        'TypeScript',
        'JavaScript',
        'Node.js',
        'Firebase',
        'Git',
        'HTML',
        'CSS'
      ]
    }
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    inLanguage: 'en-US',
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Enhanced structured data for portfolio projects
export function generatePortfolioStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${siteConfig.author.name} - Portfolio`,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url
    },
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    keywords: siteConfig.keywords.join(', '),
    mainEntity: {
      '@type': 'Person',
      name: siteConfig.author.name
    }
  };
}

// Organization structured data for professional context
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${siteConfig.author.name} - Development Services`,
    description: 'Professional web and mobile development services',
    url: siteConfig.url,
    founder: {
      '@type': 'Person',
      name: siteConfig.author.name
    },
    serviceType: [
      'Web Development',
      'Mobile App Development',
      'Frontend Development',
      'Backend Development',
      'Full-Stack Development'
    ],
    areaServed: 'Worldwide',
    availableLanguage: 'English',
    priceRange: '$$',
    telephone: 'Available upon request',
    email: siteConfig.author.email
  };
}