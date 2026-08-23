import type {NextConfig} from 'next'

// The origin Sanity Studio's Presentation tool runs at — needs to be
// allowed to iframe this site for Visual Editing to work.
const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.sanity.io;
  font-src 'self';
  connect-src 'self' https://*.api.sanity.io;
  worker-src 'self' blob:;
  frame-ancestors 'self' ${studioUrl};
`;



const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
  serverExternalPackages: ["playwright", "react-dom","vitest"],
}

export default nextConfig
