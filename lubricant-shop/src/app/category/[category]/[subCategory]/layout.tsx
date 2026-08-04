import { getCategoryBySlug } from "@/assets/category/categories";
import { getProductsBySubCategory } from "@/assets/category/products";
import { PageLayout } from "@/components/common/Layout";
import CategoryContainer from "@/containers/CategoryContainer";
import { notFound, redirect } from "next/navigation";
import React from "react";

type CategoryDetailLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    category: string;
    subCategory: string;
  }>;
};

const CategoryDetailLayout = async ({
  children,
  params,
}: CategoryDetailLayoutProps) => {
  const { category: categorySlug, subCategory: subCategorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const subCategory = category.subCategories.find(
    (item) => item.slug === subCategorySlug,
  );

  if (!subCategory) {
    redirect(`/category/${category.slug}/${category.subCategories[0].slug}`);
  }

  const products = getProductsBySubCategory(category.slug, subCategory.slug);

  return (
    <PageLayout>
      <CategoryContainer
        category={category}
        subCategory={subCategory}
        totalCount={products.length}
      >
        {children}
      </CategoryContainer>
    </PageLayout>
  );
};

export default CategoryDetailLayout;
