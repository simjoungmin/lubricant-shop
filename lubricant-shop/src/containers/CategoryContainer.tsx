import { categories } from "@/assets/category/categories";
import type { Category, SubCategory } from "@/assets/category/types";
import CategorySidebar from "@/components/category/CategorySidebar";
import SubCategoryTabs from "@/components/category/SubCategoryTabs";
import ProductListControls from "@/components/common/ProductListControls/ProductListControls";
import OilFooter from "@/components/layout/OilFooter";
import OilHeader from "@/components/layout/OilHeader";
import React from "react";

type CategoryContainerProps = {
  category?: Category;
  subCategory?: SubCategory;
  totalCount: number;
  showAllProducts?: boolean;
  children: React.ReactNode;
};

const services = ["정품 보장", "빠른 배송", "전문 상담", "안전 거래"];

const CategoryContainer = ({
  category,
  subCategory,
  totalCount,
  showAllProducts = false,
  children,
}: CategoryContainerProps) => {
  const title = showAllProducts ? "전체 품목" : subCategory?.label;
  const description = showAllProducts
    ? "카테고리에 등록된 모든 상품을 한 번에 확인하세요."
    : category?.description;

  return (
    <>
      <OilHeader />
      <main className="bg-[#11100d]">
        <section className="border-b border-white/10 bg-gradient-to-b from-[#1b1a17] to-[#11100d]">
          <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-6 py-4 text-xs text-zinc-500 lg:px-8">
            <span>홈</span>
            <span>/</span>
            <span>카테고리</span>
            {category ? (
              <>
                <span>/</span>
                <span>{category.title}</span>
              </>
            ) : null}
            <span>/</span>
            <span className="text-[#d6a84f]">{title}</span>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
          <CategorySidebar
            selectedCategorySlug={category?.slug}
            showAllProducts={showAllProducts}
          />

          <div>
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-black text-white">{title}</h2>
                <p className="mt-3 text-sm text-zinc-400">{description}</p>
              </div>
            </div>
            <ProductListControls
                totalCount={totalCount}
                showPageSize={!showAllProducts}
              />
            {category && subCategory ? (
              <SubCategoryTabs
                category={category}
                selectedSubCategorySlug={subCategory.slug}
              />
            ) : null}
            {children}
          </div>
          
        </section>

        <section className="border-t border-white/10 bg-[#11100d]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-4 px-6 py-8 text-sm md:grid-cols-4 lg:px-8">
            {services.map((service) => (
              <div
                key={service}
                className="border-l border-white/10 pl-5 first:border-l-0"
              >
                <p className="font-bold text-[#d6a84f]">{service}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  OIL MASTER 공식 서비스
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <OilFooter />
    </>
  );
};

export const getDefaultCategoryRoute = () => {
  const category = categories[0];
  const subCategory = category.subCategories[0];

  return `/category/${category.slug}/${subCategory.slug}`;
};

export default CategoryContainer;
