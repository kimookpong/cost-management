/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  images: {
    domains: ["hrms.wu.ac.th"],
  },
  // assetPrefix: isProd ? "/cost-management/" : "",
  // basePath: isProd ? "/cost-management" : "",
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
