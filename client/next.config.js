/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://206.81.11.40/api/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
