import { categories } from "@/assets/category/categories";
import type { Category, CategorySlug, SubCategory } from "@/assets/category/types";
import type { OilSearchOption } from "@/types/oil-search-filter.types";

const toSubCategoryOption = (subCategory: SubCategory): OilSearchOption => ({
  label: subCategory.label,
  value: subCategory.slug,
});

export const getMainOilCategoryOptions = (): OilSearchOption[] =>
  categories.map((category) => ({
    label: category.title,
    value: category.slug,
  }));

export const getMainOilSubCategoryOptions = (
  categorySlug: CategorySlug | "",
): OilSearchOption[] => {
  const category = getMainOilCategory(categorySlug);

  return category?.subCategories.map(toSubCategoryOption) ?? [];
};

export const getMainOilCategory = (categorySlug: CategorySlug | ""): Category | undefined => {
  if (!categorySlug) {
    return undefined;
  }

  return categories.find((category) => category.slug === categorySlug);
};

export const getMainOilSearchRoute = (
  categorySlug: CategorySlug | "",
  subCategorySlug: string,
  keyword: string,
) => {
  const searchParams = new URLSearchParams();
  const trimmedKeyword = keyword.trim();

  if (trimmedKeyword) {
    searchParams.set("q", trimmedKeyword);
  }

  const route =
    categorySlug && subCategorySlug
      ? `/category/${categorySlug}/${subCategorySlug}`
      : "/category";
  const queryString = searchParams.toString();

  return queryString ? `${route}?${queryString}` : route;
};
