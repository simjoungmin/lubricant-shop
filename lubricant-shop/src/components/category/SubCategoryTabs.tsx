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
            className={`rounded-md border px-4 py-2 text-sm transition ${
              isActive
                ? "border-[#d6a84f] bg-[#d6a84f] text-black"
                : "border-white/10 bg-[#171511] text-zinc-300 hover:border-[#d6a84f]/70 hover:text-white"
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
