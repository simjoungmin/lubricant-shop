"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export const PRODUCT_IMAGE_SIZES = {
  categoryIcon: "118px",
  thumbnail: "64px",
  cart: "72px",
  adminPreview: "96px",
  card: "(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 224px",
  carouselCard: "224px",
  detail: "(max-width: 1024px) 90vw, 420px",
} as const;

type ProductImageProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  fallbackColor?: string;
  priority?: boolean;
};

const DEFAULT_FALLBACK_COLOR = "#b7bec7";

const normalizeProductImageSource = (src?: string | null) => {
  const trimmedSrc = src?.trim();

  if (!trimmedSrc) {
    return null;
  }

  if (trimmedSrc.startsWith("/")) {
    return trimmedSrc;
  }

  if (trimmedSrc.startsWith("product-images/")) {
    return `/${trimmedSrc}`;
  }

  try {
    const imageUrl = new URL(trimmedSrc);

    return imageUrl.protocol === "http:" || imageUrl.protocol === "https:"
      ? trimmedSrc
      : null;
  } catch {
    return null;
  }
};

export function ProductImage({
  src,
  alt,
  sizes,
  className = "object-contain",
  fallbackColor = DEFAULT_FALLBACK_COLOR,
  priority = false,
}: ProductImageProps) {
  const imageSrc = useMemo(() => normalizeProductImageSource(src), [src]);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

  if (!imageSrc || failedImageSrc === imageSrc) {
    return <ProductImageFallback alt={alt} fallbackColor={fallbackColor} />;
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailedImageSrc(imageSrc)}
    />
  );
}

function ProductImageFallback({
  alt,
  fallbackColor,
}: {
  alt: string;
  fallbackColor: string;
}) {
  return (
    <div
      aria-label={alt}
      role="img"
      className="absolute inset-0 flex items-center justify-center bg-[#fbfcfd]"
    >
      <div
        className="relative flex h-[72%] max-h-[160px] min-h-[52px] w-[46%] min-w-[38px] max-w-[96px] flex-col items-center justify-center rounded-[18px_18px_12px_12px] border border-[#dce2e8] shadow-sm"
        style={{ backgroundColor: fallbackColor }}
      >
        <span className="absolute -top-[12%] h-[16%] min-h-[8px] w-[48%] rounded-t-md bg-[#2d3744]" />
        <span className="rounded bg-white px-1.5 py-1 text-center text-[10px] font-black leading-tight text-[#071d3b]">
          OIL
        </span>
      </div>
    </div>
  );
}
