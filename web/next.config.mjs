/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let assetPrefix = '';
let basePath = '';

if (isGithubActions) {
  // 去掉 `<owner>/`
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');

  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}
const nextConfig = {
  basePath,
  assetPrefix,
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
