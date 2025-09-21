import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'John Developer';
    const description = searchParams.get('description') || 'Full-Stack Developer & Mobile App Specialist';
    const theme = searchParams.get('theme') || 'light';

    const isDark = theme === 'dark';
    const bgColor = isDark ? '#0a0a0a' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0a0a0a';
    const accentColor = '#3b82f6';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            backgroundImage: isDark 
              ? 'radial-gradient(circle at 25px 25px, #1f2937 2px, transparent 0), radial-gradient(circle at 75px 75px, #1f2937 2px, transparent 0)'
              : 'radial-gradient(circle at 25px 25px, #f3f4f6 2px, transparent 0), radial-gradient(circle at 75px 75px, #f3f4f6 2px, transparent 0)',
            backgroundSize: '100px 100px',
            padding: '40px',
          }}
        >
          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '60px',
                backgroundColor: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px',
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              JD
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: textColor,
                marginBottom: '20px',
                lineHeight: '1.1',
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '32px',
                color: isDark ? '#9ca3af' : '#6b7280',
                marginBottom: '40px',
                lineHeight: '1.4',
              }}
            >
              {description}
            </p>

            {/* Tech stack */}
            <div
              style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {['React', 'Next.js', 'Flutter', 'TypeScript'].map((tech) => (
                <span
                  key={tech}
                  style={{
                    backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
                    color: textColor,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '20px',
                    fontWeight: '500',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: isDark ? '#9ca3af' : '#6b7280',
              fontSize: '18px',
            }}
          >
            <span>johndeveloper.dev</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}