/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: false,
  headers: () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store",
        },
      ],
    },
  ],
};

export default nextConfig;
