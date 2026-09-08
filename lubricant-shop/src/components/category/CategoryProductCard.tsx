import type { Product } from "@/assets/category/types";
import { formatPrice, getDiscountRate } from "@/components/cart/cart.utils";
import Button from "@/components/common/Button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type CategoryProductCardProps = {
  product: Product;
};

const CategoryProductCard = ({ product }: CategoryProductCardProps) => {
  const discountRate = getDiscountRate(product.originalPrice, product.price);

  return (
    <article className="group rounded-lg border border-[#dde2e8] bg-white p-4 transition hover:-translate-y-1 hover:border-[#ff8a65] hover:shadow-[0_14px_28px_rgba(7,29,59,0.08)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded bg-[#ff4b1f] px-2 py-1 text-[10px] font-black text-white">
          {product.badge}
        </span>
        <Button
          type="cart"
          product={product}
          className="flex h-8 w-8 items-center justify-center rounded border border-[#dce2e8] text-sm text-[#071d3b] hover:border-[#ff4b1f] hover:text-[#ff4b1f]"
        >
          +
        </Button>
      </div>

      <Link href={`/products/${product.id}`} className="block">
        <div className="mb-4 flex h-[178px] items-center justify-center rounded-md bg-[#fbfcfd]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={130}
              height={130}
              className="h-[130px] w-[130px] object-contain"
            />
          ) : (
            <div
              className="relative flex h-[130px] w-[72px] flex-col items-center justify-center rounded-[18px_18px_12px_12px] border border-[#dce2e8] shadow-lg"
              style={{ backgroundColor: product.color }}
            >
              <div className="absolute -top-5 h-6 w-9 rounded-t-md bg-[#2d3744]" />
              <div className="w-[52px] rounded bg-white px-1 py-2 text-center text-[10px] font-black leading-tight text-[#071d3b]">
                OIL
                <br />
                MASTER
              </div>
            </div>
          )}
        </div>

        <h3 className="min-h-10 text-sm font-black leading-5 text-[#071d3b]">
          {product.name}
        </h3>
        <p className="mt-1 text-xs font-semibold text-[#8a94a1]">{product.spec}</p>
        {discountRate > 0 ? (
          <p className="mt-4 text-xs font-bold text-[#8a94a1] line-through">
            {formatPrice(product.originalPrice ?? product.price)}
          </p>
        ) : null}
        <div className="mt-1 flex items-baseline gap-2">
          {discountRate > 0 ? (
            <span className="text-lg font-black text-[#ff4b1f]">{discountRate}%</span>
          ) : null}
          <p className="text-lg font-black text-[#071d3b]">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
};

export default CategoryProductCard;
