import type { CategorySlug } from "@/assets/category/types";

export type OilSearchOption = {
  label: string;
  value: string;
};

export type MainOilSearchFilterState = {
  categorySlug: CategorySlug | "";
  subCategorySlug: string;
  keyword: string;
};
