import type {NextConfig} from 'next'

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.sanity.io;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
`;



const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
    
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
  serverExternalPackages: ["playwright", "react-dom"],
}

export default nextConfig
