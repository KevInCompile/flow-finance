/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
        pathname: "/**",
      },
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
