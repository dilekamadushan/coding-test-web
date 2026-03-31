/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.quartr.com",
      },
    ],
  },
};

module.exports = nextConfig
