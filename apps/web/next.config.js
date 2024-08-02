/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PORT: '3000',
    THUMBNAIL_API_URL: 'http://localhost:8000/thumbnail',
    API_URL: 'http://localhost:8000/api',
    BASE_URL: 'http://localhost:3000',
    ACCESS_TOKEN_SECRET: '1234567890qwertyuiop',
    REFRESH_TOKEN_SECRET: 'asdfghjklzxcvbnm',
    EMAIL_VERIFICATION_SECRET: '0987654321lkjhgfdsa',
  },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
};

module.exports = nextConfig;
