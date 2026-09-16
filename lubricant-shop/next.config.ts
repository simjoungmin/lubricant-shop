import type { NextConfig } from "next";

type ImageRemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const defaultImageRemotePatterns: ImageRemotePattern[] = [
  {
    protocol: "https",
    hostname: "bridgeindustrial.com",
    pathname: "/wp-content/uploads/**",
  },
  {
    protocol: "https",
    hostname: "wics.com.au",
    pathname: "/cdn/shop/files/**",
  },
];

const imageRemotePatterns = (process.env.NEXT_PUBLIC_IMAGE_REMOTE_PATTERNS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map<ImageRemotePattern | null>((origin) => {
    try {
      const url = new URL(origin);
      const protocol = url.protocol.replace(":", "");

      if (protocol !== "http" && protocol !== "https") {
        return null;
      }

      const pathname = url.pathname === "/" ? "/**" : `${url.pathname.replace(/\/$/, "")}/**`;

      return {
        protocol,
        hostname: url.hostname,
        port: url.port,
        pathname,
      };
    } catch {
      return null;
    }
  })
  .filter((pattern): pattern is ImageRemotePattern => pattern !== null);

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [32, 48, 64, 72, 96, 118, 128, 160, 192, 224, 256, 320, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [...defaultImageRemotePatterns, ...imageRemotePatterns],
  },
};

export default nextConfig;
