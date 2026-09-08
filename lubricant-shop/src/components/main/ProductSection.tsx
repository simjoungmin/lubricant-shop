"use client";

import type { Product, ProductBadge } from "@/assets/category/types";
import { formatPrice, getDiscountRate } from "@/components/cart/cart.utils";
import Button from "@/components/common/Button";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type ProductSectionProps = {
  title: string;
  badge: ProductBadge;
  products: Product[];
};

const PRODUCT_CARD_WIDTH = 224;
const PRODUCT_CARD_GAP = 16;
const SCROLL_DISTANCE = PRODUCT_CARD_WIDTH + PRODUCT_CARD_GAP;

const ProductSection = ({ title, badge, products }: ProductSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -SCROLL_DISTANCE,
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: SCROLL_DISTANCE,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#f7f7f5] py-8">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black">{title}</h2>

          <Link href="/category" className="text-sm font-bold text-[#65717f] hover:text-[#ff4b1f]">
            더보기 +
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="relative">
            <button
              type="button"
              aria-label={`${title} 왼쪽으로 이동`}
              className="absolute -left-14 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#cfd6de] bg-white/95 text-2xl font-black text-[#071d3b] shadow-[0_10px_24px_rgba(7,29,59,0.12)] transition hover:border-[#ff4b1f] hover:text-[#ff4b1f]"
              onClick={handleScrollLeft}
            >
              ‹
            </button>

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto pt-2 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex min-w-max gap-4">
                {products.map((product) => {
                  const discountRate = getDiscountRate(product.originalPrice, product.price);

                  return (
                    <article
                      key={`${title}-${product.id}`}
                      className="group w-[224px] shrink-0 rounded border border-[#dde2e8] bg-white p-4 transition hover:-translate-y-1 hover:border-[#ff8a65] hover:shadow-[0_14px_28px_rgba(7,29,59,0.08)]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded bg-[#ff4b1f] px-2 py-1 text-[10px] font-black text-white">
                          {badge}
                        </span>
                        <Button
                          type="cart"
                          product={{ ...product, badge }}
                          className="flex h-8 w-8 items-center justify-center rounded border border-[#dce2e8] text-sm text-[#071d3b] hover:border-[#ff4b1f] hover:text-[#ff4b1f]"
                        >
                          +
                        </Button>
                      </div>

                      <Link href={`/products/${product.id}`} className="block">
                        <div className="mb-4 flex h-[170px] items-center justify-center bg-[#fbfcfd]">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={140}
                              height={140}
                              className="h-[136px] w-[136px] object-contain"
                            />
                          ) : (
                            <div
                              className="flex h-[132px] w-[86px] items-center justify-center rounded-xl border border-[#dce2e8] text-center text-sm font-black text-white"
                              style={{ backgroundColor: product.color }}
                            >
                              OIL
                            </div>
                          )}
                        </div>

                        <h3 className="line-clamp-2 min-h-10 text-sm font-black text-[#071d3b]">
                          {product.name}
                        </h3>
                        <p className="mt-1 min-h-4 text-xs font-semibold text-[#8a94a1]">
                          {product.spec}
                        </p>
                        {discountRate > 0 ? (
                          <p className="mt-3 text-xs font-bold text-[#8a94a1] line-through">
                            {formatPrice(product.originalPrice ?? product.price)}
                          </p>
                        ) : null}
                        <div className="mt-1 flex items-baseline gap-2">
                          {discountRate > 0 ? (
                            <span className="text-lg font-black text-[#ff4b1f]">
                              {discountRate}%
                            </span>
                          ) : null}
                          <p className="text-lg font-black text-[#071d3b]">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs font-bold text-[#ff4b1f]">★★★★★</p>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              aria-label={`${title} 오른쪽으로 이동`}
              className="absolute -right-14 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#cfd6de] bg-white/95 text-2xl font-black text-[#071d3b] shadow-[0_10px_24px_rgba(7,29,59,0.12)] transition hover:border-[#ff4b1f] hover:text-[#ff4b1f]"
              onClick={handleScrollRight}
            >
              ›
            </button>
          </div>
        ) : (
          <div className="rounded border border-[#dde2e8] bg-white px-6 py-12 text-center text-sm font-semibold text-[#65717f]">
            표시할 상품이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
