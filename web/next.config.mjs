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
    ],
  },
};

export default nextConfig;
