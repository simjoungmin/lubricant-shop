import CategoryProductGrid from "@/components/category/CategoryProductGrid";
import { productApi } from "@/components/category/product.api";

type CategoryDetailPageProps = {
  params: Promise<{
    category: string;
    subCategory: string;
  }>;
  searchParams: Promise<{
    brand?: string;
    fuelType?: string;
    q?: string;
    standard?: string;
    sort?: string;
    pageSize?: string;
    viscosity?: string;
  }>;
};

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryDetailPageProps) {
  const { category, subCategory } = await params;
  const {
    brand = "",
    fuelType = "",
    q = "",
    standard = "",
    sort = "popular",
    pageSize = "20",
    viscosity = "",
  } = await searchParams;
  const products = await productApi.findProducts({
    category,
    subCategory,
    brand,
    q,
    fuelType,
    viscosity,
    standard,
    sort,
  });
  const shouldShowBrandFilter =
    category === "engine" && subCategory === "brand-engine-oil";
  const brandOptions = shouldShowBrandFilter
    ? await productApi.findBrands({
        category,
        subCategory,
        q,
        fuelType,
        viscosity,
        standard,
      })
    : [];
  const parsedPageSize = Number(pageSize);
  const visibleCount = Number.isFinite(parsedPageSize)
    ? Math.min(Math.max(Math.floor(parsedPageSize), 1), 100)
    : 20;
  const displayProducts = products.slice(0, visibleCount);

  return (
    <CategoryProductGrid
      products={displayProducts}
      brandOptions={brandOptions}
      selectedBrand={brand}
    />
  );
}
