import { categories } from "@/assets/category/categories";
import type { Category, SubCategory } from "@/assets/category/types";
import CategorySidebar from "@/components/category/CategorySidebar";
import ProductListControls from "@/components/common/ProductListControls/ProductListControls";
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
      <main className="bg-white">
        <section className="border-b border-[#e2e6eb] bg-white">
          <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-6 py-4 text-xs font-semibold text-[#7a8490] lg:px-8">
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
            <span className="text-[#ff4b1f]">{title}</span>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
          <CategorySidebar
            key={category?.slug ?? "all-products"}
            selectedCategorySlug={category?.slug}
            selectedSubCategorySlug={subCategory?.slug}
            showAllProducts={showAllProducts}
          />

          <div>
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#e2e6eb] pb-6 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-black text-[#071d3b]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#65717f]">{description}</p>
              </div>
            </div>
            <ProductListControls totalCount={totalCount} showPageSize={!showAllProducts} />
            {children}
          </div>
        </section>

        <section className="border-t border-[#e2e6eb] bg-white">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-4 px-6 py-8 text-sm md:grid-cols-4 lg:px-8">
            {services.map((service) => (
              <div
                key={service}
                className="border-l border-[#e2e6eb] pl-5 first:border-l-0"
              >
                <p className="font-black text-[#071d3b]">{service}</p>
                <p className="mt-1 text-xs font-semibold text-[#7a8490]">
                  OIL MASTER 공식 서비스
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export const getDefaultCategoryRoute = () => {
  const category = categories[0];
  const subCategory = category.subCategories[0];

  return `/category/${category.slug}/${subCategory.slug}`;
};

export default CategoryContainer;
