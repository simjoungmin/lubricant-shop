import type { Product } from "@/assets/category/types";
import { formatPrice } from "@/components/cart/cart.utils";
import Button from "@/components/common/Button";
import React from "react";

type CategoryProductCardProps = {
  product: Product;
};

const CategoryProductCard = ({ product }: CategoryProductCardProps) => {
  return (
    <article className="group rounded-lg border border-white/10 bg-[#1a1814] p-4 transition hover:-translate-y-1 hover:border-[#d6a84f]/70">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded px-2 py-1 text-[10px] font-black ${
            product.badge === "HOT"
              ? "bg-red-600 text-white"
              : "bg-[#d6a84f] text-black"
          }`}
        >
          {product.badge}
        </span>
        <Button type="cart" product={product} />
      </div>

      <div className="mb-4 flex h-[178px] items-center justify-center rounded-md bg-gradient-to-br from-[#2b261e] to-[#0b0b0a]">
        <div
          className="relative flex h-[130px] w-[72px] flex-col items-center justify-center rounded-[18px_18px_12px_12px] border border-white/20 shadow-2xl"
          style={{ backgroundColor: product.color }}
        >
          <div className="absolute -top-5 h-6 w-9 rounded-t-md bg-zinc-300" />
          <div className="w-[52px] rounded bg-white px-1 py-2 text-center text-[10px] font-black leading-tight text-black">
            OIL
            <br />
            MASTER
          </div>
        </div>
      </div>

      <h3 className="min-h-10 text-sm font-semibold leading-5 text-white">
        {product.name}
      </h3>
      <p className="mt-1 text-xs text-zinc-500">{product.spec}</p>
      <p className="mt-4 text-lg font-black text-white">
        {formatPrice(product.price)}
      </p>
    </article>
  );
};

export default CategoryProductCard;
