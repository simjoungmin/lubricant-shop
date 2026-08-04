"use client";

import type { Product, ProductBadge } from "@/assets/category/types";
import { formatPrice } from "@/components/cart/cart.utils";
import Button from "@/components/common/Button";
import Link from "next/link";

type ProductSectionProps = {
  title: string;
  badge: ProductBadge;
};

const sectionProducts: Product[] = [
  {
    id: 1,
    categorySlug: "engine",
    subCategorySlug: "5w-30",
    name: "프리미엄 합성 엔진오일",
    spec: "5W-30 / 4L",
    price: 78000,
    badge: "HOT",
    color: "#c8a24a",
  },
  {
    id: 2,
    categorySlug: "engine",
    subCategorySlug: "5w-40",
    name: "고성능 디젤 엔진오일",
    spec: "5W-40 / 6L",
    price: 95000,
    badge: "BEST",
    color: "#b95d38",
  },
  {
    id: 3,
    categorySlug: "engine",
    subCategorySlug: "0w-20",
    name: "하이브리드 전용 오일",
    spec: "0W-20 / 4L",
    price: 85000,
    badge: "HOT",
    color: "#3d7f8f",
  },
  {
    id: 4,
    categorySlug: "engine",
    subCategorySlug: "5w-30",
    name: "가솔린 차량용 오일",
    spec: "5W-30 / 4L",
    price: 72000,
    badge: "BEST",
    color: "#46637d",
  },
  {
    id: 5,
    categorySlug: "engine",
    subCategorySlug: "0w-40",
    name: "유럽차 전용 엔진오일",
    spec: "0W-40 / 5L",
    price: 108000,
    badge: "HOT",
    color: "#4b4b50",
  },
];

const ProductSection = ({ title, badge }: ProductSectionProps) => {
  const products = sectionProducts.map((product) => ({
    ...product,
    badge,
  }));

  return (
    <section className="bg-[#11100d] py-12">
      <div className="mx-auto max-w-[1440px] px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            <span className="mr-2 text-[#d6a84f]">{title.split(" ")[0]}</span>
            {title.split(" ").slice(1).join(" ")}
          </h2>

          <Link
            href="/category"
            className="text-sm text-zinc-400 hover:text-[#d6a84f]"
          >
            더보기 +
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {products.map((product) => (
            <article
              key={`${title}-${product.id}`}
              className="group rounded-2xl border border-white/10 bg-[#1b1813] p-4 transition hover:-translate-y-1 hover:border-[#d6a84f]/70"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded bg-red-600 px-2 py-1 text-[10px] font-bold">
                  {badge}
                </span>
                <Button
                  type="cart"
                  product={product}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-base text-zinc-400 hover:border-[#d6a84f] hover:text-[#d6a84f]"
                >
                  🛒
                </Button>
              </div>

              <div className="mb-5 flex h-[180px] items-center justify-center rounded-xl bg-gradient-to-br from-[#2a261e] to-[#0d0d0b]">
                <div
                  className="flex h-[130px] w-[80px] items-center justify-center rounded-xl border border-[#d6a84f]/40 bg-black/40 text-center text-sm font-black text-white"
                  style={{ backgroundColor: product.color }}
                >
                  OIL
                </div>
              </div>

              <h3 className="line-clamp-2 text-sm font-semibold">
                {product.name}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">{product.spec}</p>
              <p className="mt-4 font-bold text-[#d6a84f]">
                {formatPrice(product.price)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
