/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  images: {
    domains: ["hrms.wu.ac.th"],
  },
  assetPrefix: isProd ? "/cost-management/" : "",
  basePath: isProd ? "/cost-management" : "",
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
