import type { Category } from "@/assets/category/types";
import Link from "next/link";
import React from "react";

type SubCategoryTabsProps = {
  category: Category;
  selectedSubCategorySlug: string;
};

const SubCategoryTabs = ({
  category,
  selectedSubCategorySlug,
}: SubCategoryTabsProps) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {category.subCategories.map((subCategory) => {
        const isActive = selectedSubCategorySlug === subCategory.slug;

        return (
          <Link
            key={subCategory.slug}
            href={`/category/${category.slug}/${subCategory.slug}`}
            className={`rounded-md border px-4 py-2 text-sm font-black transition ${
              isActive
                ? "border-[#071d3b] bg-[#071d3b] text-white"
                : "border-[#dce2e8] bg-white text-[#34465c] hover:border-[#ff8a65] hover:bg-[#fff3ef] hover:text-[#ff4b1f]"
            }`}
          >
            {subCategory.label}
          </Link>
        );
      })}
    </div>
  );
};

export default SubCategoryTabs;
