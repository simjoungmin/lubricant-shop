"use client";

import { categories } from "@/assets/category/categories";
import type { CategorySlug } from "@/assets/category/types";
import Link from "next/link";
import React, { useState } from "react";

type CategorySidebarProps = {
  selectedCategorySlug?: CategorySlug;
  selectedSubCategorySlug?: string;
  showAllProducts?: boolean;
};

const CategorySidebar = ({
  selectedCategorySlug,
  selectedSubCategorySlug,
  showAllProducts = false,
}: CategorySidebarProps) => {
  const [openCategorySlug, setOpenCategorySlug] = useState<CategorySlug | null>(
    showAllProducts ? null : selectedCategorySlug ?? null,
  );

  const handleCategoryClick = (categorySlug: CategorySlug) => {
    setOpenCategorySlug((currentSlug) =>
      currentSlug === categorySlug ? null : categorySlug,
    );
  };

  return (
    <aside className="lg:sticky lg:top-[96px] lg:self-start">
      <div className="mb-6">
        <p className="text-sm font-black text-[#ff4b1f]">
          내 차에 맞는 오일을 선택하세요
        </p>
        <h1 className="mt-3 text-4xl font-black text-[#071d3b]">Category</h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#dde2e8] bg-white">
        <Link
          href="/category"
          className={`flex w-full items-center justify-between border-b border-[#edf0f3] px-5 py-4 text-left transition ${
            showAllProducts
              ? "bg-[#071d3b] text-white"
              : "text-[#34465c] hover:bg-[#fff3ef] hover:text-[#ff4b1f]"
          }`}
        >
          <span className="text-sm font-black">전체 품목</span>
          <span className="text-xs">{showAllProducts ? "-" : "+"}</span>
        </Link>
        {categories.map((category) => {
          const isSelected = !showAllProducts && selectedCategorySlug === category.slug;
          const isOpen = openCategorySlug === category.slug;

          return (
            <div key={category.slug} className="border-b border-[#edf0f3] last:border-b-0">
              <button
                className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
                  isSelected
                    ? "bg-[#071d3b] text-white"
                    : "text-[#34465c] hover:bg-[#fff3ef] hover:text-[#ff4b1f]"
                }`}
                type="button"
                onClick={() => handleCategoryClick(category.slug)}
              >
                <span className="text-sm font-black">{category.title}</span>
                <span className="text-xs">{isOpen ? "v" : ">"}</span>
              </button>

              {isOpen ? (
                <div className="bg-[#fafbfc] py-2">
                  {category.subCategories.map((subCategory) => {
                    const isSubCategoryActive =
                      isSelected && selectedSubCategorySlug === subCategory.slug;

                    return (
                      <Link
                        key={subCategory.slug}
                        href={`/category/${category.slug}/${subCategory.slug}`}
                        className={`flex items-center gap-2 px-8 py-2.5 text-sm font-bold transition ${
                          isSubCategoryActive
                            ? "text-[#ff4b1f]"
                            : "text-[#65717f] hover:bg-[#fff3ef] hover:text-[#ff4b1f]"
                        }`}
                      >
                        <span className="text-xs text-[#a4adb8]">-</span>
                        <span>{subCategory.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-[#dde2e8] bg-white p-5">
        <p className="text-sm font-black text-[#071d3b]">고객센터</p>
        <p className="mt-2 text-2xl font-black text-[#ff4b1f]">02-1234-5678</p>
        <p className="mt-2 text-xs font-semibold leading-5 text-[#7a8490]">
          평일 09:00 - 18:00
          <br />
          점심 12:00 - 13:00
        </p>
      </div>
    </aside>
  );
};

export default CategorySidebar;
