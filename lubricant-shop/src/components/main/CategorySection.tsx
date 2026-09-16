import { ProductImage, PRODUCT_IMAGE_SIZES } from "@/components/common/ProductImage";
import Link from "next/link";
import React from "react";
import MainOilSearchFilter from "./MainOilSearchFilter";

const categories = [
  {
    label: "엔진오일",
    description: "브랜드 / 점도 / 차종",
    href: "/category/engine/brand-engine-oil",
    color: "#b7bec7",
  },
  {
    label: "자동 미션 오일",
    description: "ATF / CVT / DCT",
    href: "/category/mission/atf",
    color: "#bf2331",
  },
  {
    label: "기어 오일",
    description: "기어 / 트랜스퍼 / 할덱스",
    href: "/category/gear/gear-oil",
    color: "#a0a9b4",
  },
  {
    label: "브레이크액·파워오일",
    description: "브레이크액 / 파워오일",
    href: "/category/brake-power/brake-fluid",
    color: "#286c98",
  },
  {
    label: "부동액",
    description: "색상별 냉각수",
    href: "/category/coolant/green",
    color: "#26709b",
  },
  {
    label: "케미컬·첨가제",
    description: "첨가제 / 세정제 / 그리스",
    href: "/category/chemical/engine-system",
    color: "#5f7f8f",
  },
];

const CategorySection = () => {
  return (
    <section className="bg-[#f7f7f5] pb-10">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <MainOilSearchFilter />

        <div className="mt-8">
          <p className="text-xs font-black uppercase text-[#ff4b1f]">Category</p>
          <h2 className="mt-2 text-2xl font-black">카테고리 쇼핑</h2>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="group rounded border border-[#dde2e8] bg-white p-5 text-center transition hover:-translate-y-1 hover:border-[#ff8a65] hover:shadow-[0_14px_28px_rgba(7,29,59,0.08)]"
            >
              <div className="relative mx-auto h-28 overflow-hidden">
                <ProductImage
                  alt={`${category.label} 상품`}
                  sizes={PRODUCT_IMAGE_SIZES.categoryIcon}
                  fallbackColor={category.color}
                  className="object-contain p-4"
                />
              </div>
              <p className="mt-3 text-sm font-black">
                {category.label} <span className="text-[#ff4b1f]">›</span>
              </p>
              <p className="mt-1 text-xs font-semibold text-[#7a8490]">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
