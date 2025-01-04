/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icons.veryicon.com',
        port: '',
        pathname: '/png/**',
      },
      {
        protocol: 'https',
        hostname: 'dapplottery.vercel.app',
        port: '',
        pathname: '/_next/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/photo/**',
      },
    ],
  },
};

export default nextConfig;
