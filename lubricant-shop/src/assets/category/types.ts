export type CategorySlug =
  | "engine"
  | "mission"
  | "brake"
  | "filter"
  | "gear"
  | "chemical";

export type ProductBadge = "BEST" | "HOT";

export type ProductFuelType = "gasoline" | "diesel" | "hybrid" | "europe";

export type ProductSearchFilters = {
  keyword?: string;
  fuelType?: string;
  viscosity?: string;
  standard?: string;
};

export type SubCategory = {
  slug: string;
  label: string;
};

export type Category = {
  slug: CategorySlug;
  title: string;
  description: string;
  subCategories: SubCategory[];
};

export type Product = {
  id: number;
  categorySlug: CategorySlug;
  subCategorySlug: string;
  name: string;
  spec: string;
  price: number;
  pointRewardRatePercent?: number;
  badge: ProductBadge;
  color: string;
};
