/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: 'http://localhost:8000/api',
    BASE_URL: 'http://localhost:3000',
    ACCESS_TOKEN_SECRET: '1234567890qwertyuiop',
    REFRESH_TOKEN_SECRET: 'asdfghjklzxcvbnm',
    EMAIL_VERIFICATION_SECRET: '0987654321lkjhgfdsa',
  },
};

module.exports = nextConfig;
