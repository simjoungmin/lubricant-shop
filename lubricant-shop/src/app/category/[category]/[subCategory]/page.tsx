import {
  getDisplayProducts,
  getProductsBySubCategory,
} from "@/assets/category/products";
import CategoryProductGrid from "@/components/category/CategoryProductGrid";

type CategoryDetailPageProps = {
  params: Promise<{
    category: string;
    subCategory: string;
  }>;
  searchParams: Promise<{
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
    fuelType = "",
    q = "",
    standard = "",
    sort = "popular",
    pageSize = "20",
    viscosity = "",
  } = await searchParams;
  const products = getProductsBySubCategory(category, subCategory);
  const displayProducts = getDisplayProducts(products, sort, pageSize, {
    keyword: q,
    fuelType,
    viscosity,
    standard,
  });

  return <CategoryProductGrid products={displayProducts} />;
}
