import { categories } from "@/assets/category/categories";
import type { CategorySlug } from "@/assets/category/types";
import Link from "next/link";
import React from "react";

type CategorySidebarProps = {
  selectedCategorySlug?: CategorySlug;
  showAllProducts?: boolean;
};

const CategorySidebar = ({
  selectedCategorySlug,
  showAllProducts = false,
}: CategorySidebarProps) => {
  return (
    <aside className="lg:sticky lg:top-[88px] lg:self-start">
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#d6a84f]">
          내 차에 맞는 오일을 선택하세요
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-white">
          Make it yours
        </h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#171511]">
        <Link
          href="/category"
          className={`flex w-full items-center justify-between border-b border-white/10 px-5 py-4 text-left transition ${
            showAllProducts
              ? "bg-[#3a2c15] text-[#d6a84f]"
              : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          <span className="text-sm font-semibold">전체 품목</span>
          <span className="text-xs">{showAllProducts ? "-" : "+"}</span>
        </Link>
        {categories.map((category) => {
          const isActive = !showAllProducts && selectedCategorySlug === category.slug;
          const firstSubCategory = category.subCategories[0];

          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}/${firstSubCategory.slug}`}
              className={`flex w-full items-center justify-between border-b border-white/10 px-5 py-4 text-left transition last:border-b-0 ${
                isActive
                  ? "bg-[#3a2c15] text-[#d6a84f]"
                  : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span className="text-sm font-semibold">{category.title}</span>
              <span className="text-xs">{isActive ? "-" : "+"}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-[#171511] p-5">
        <p className="text-sm font-bold text-white">고객센터</p>
        <p className="mt-2 text-2xl font-black text-[#d6a84f]">
          02-1234-5678
        </p>
        <p className="mt-2 text-xs leading-5 text-zinc-500">
          평일 09:00 - 18:00
          <br />
          점심 12:00 - 13:00
        </p>
      </div>
    </aside>
  );
};

export default CategorySidebar;
