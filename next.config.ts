import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @lingui/swc-plugin only works in webpack mode, not Turbopack
    swcPlugins: [["@lingui/swc-plugin", {}]],
  },
  turbopack: {
    rules: {
      "*.po": {
        loaders: ["@lingui/loader"],
        as: "*.js",
      },
    },
  },
  images: {
    // Vercel 이미지 최적화 할당량(402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) 회피 —
    // 이미지는 cloudfront(CDN)에서 직접 서빙. optimizer 의존 제거.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "d3qcabrfj5nst9.cloudfront.net",
        port: "",
        pathname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.po$/,
      use: {
        loader: "@lingui/loader",
      },
    });

    return config;
  },
};

export default nextConfig;

// Cloudflare 바인딩을 로컬 개발에서도 쓸 수 있게 한다 (프리뷰 배포용)
initOpenNextCloudflareForDev();
