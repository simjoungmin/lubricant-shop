export type CategorySlug =
  | "engine"
  | "mission"
  | "gear"
  | "brake-power"
  | "coolant"
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
  categorySlug: string;
  subCategorySlug: string;
  name: string;
  spec: string;
  price: number;
  originalPrice?: number;
  brand?: string;
  stock?: number;
  description?: string;
  viscosity?: string;
  specification?: string;
  volume?: string;
  imageUrl?: string;
  saleStatus?: "ON_SALE" | "SOLD_OUT" | "STOPPED" | "HIDDEN";
  pointRewardRatePercent?: number;
  badge: ProductBadge;
  color: string;
};
