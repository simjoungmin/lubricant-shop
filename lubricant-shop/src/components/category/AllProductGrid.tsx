"use client";

import type { Product } from "@/assets/category/types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import CategoryProductCard from "./CategoryProductCard";

type AllProductGridProps = {
  products: Product[];
  batchSize?: number;
};

const AllProductGrid = ({
  products,
  batchSize = 12,
}: AllProductGridProps) => {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount],
  );
  const hasMore = visibleCount < products.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) =>
            Math.min(count + batchSize, products.length),
          );
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [batchSize, hasMore, products.length]);

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#1a1814] px-6 py-16 text-center text-sm text-zinc-400">
        준비된 상품이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <CategoryProductCard key={product.id} product={product} />
        ))}
      </div>

      <div
        ref={sentinelRef}
        className="flex h-20 items-center justify-center text-xs text-zinc-500"
      >
        {hasMore ? "상품을 더 불러오는 중" : "모든 상품을 확인했습니다"}
      </div>
    </>
  );
};

export default AllProductGrid;
