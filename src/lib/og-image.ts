// Utility functions for generating Open Graph images

export interface OGImageOptions {
  title: string;
  description?: string;
  theme?: 'light' | 'dark';
  width?: number;
  height?: number;
}

export function generateOGImageURL(options: OGImageOptions): string {
  const {
    title,
    description = '',
    theme = 'light',
    width = 1200,
    height = 630,
  } = options;

  // In a real implementation, you would use a service like Vercel's @vercel/og
  // or create an API route that generates images dynamically
  const params = new URLSearchParams({
    title,
    description,
    theme,
    width: width.toString(),
    height: height.toString(),
  });

  return `/api/og?${params.toString()}`;
}

// Generate static OG image metadata
export function getStaticOGImage(filename: string = 'og-image.jpg') {
  return {
    url: `/${filename}`,
    width: 1200,
    height: 630,
    alt: 'John Developer - Full-Stack Developer Portfolio',
    type: 'image/jpeg',
  };
}

// Generate Twitter Card image metadata
export function getTwitterCardImage(filename: string = 'twitter-card.jpg') {
  return {
    url: `/${filename}`,
    width: 1200,
    height: 600,
    alt: 'John Developer - Full-Stack Developer Portfolio',
    type: 'image/jpeg',
  };
}

// SEO-optimized image dimensions for different use cases
export const imageDimensions = {
  ogImage: { width: 1200, height: 630 },
  twitterCard: { width: 1200, height: 600 },
  appleTouchIcon: { width: 180, height: 180 },
  favicon32: { width: 32, height: 32 },
  favicon16: { width: 16, height: 16 },
  androidChrome192: { width: 192, height: 192 },
  androidChrome512: { width: 512, height: 512 },
  profileImage: { width: 400, height: 400 },
  projectThumbnail: { width: 600, height: 400 },
  skillIcon: { width: 64, height: 64 },
} as const;