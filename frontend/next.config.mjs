/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:4000/api/:path*"
            : "https://kickshub.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
