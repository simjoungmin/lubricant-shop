import type { Product } from "@/assets/category/types";
import React from "react";
import CategoryProductCard from "./CategoryProductCard";

type CategoryProductGridProps = {
  products: Product[];
};

const CategoryProductGrid = ({ products }: CategoryProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#1a1814] px-6 py-16 text-center text-sm text-zinc-400">
        준비된 상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <CategoryProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CategoryProductGrid;
