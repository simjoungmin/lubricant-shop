import { products, searchProducts, sortProducts } from "@/assets/category/products";
import AllProductGrid from "@/components/category/AllProductGrid";
import { PageLayout } from "@/components/common/Layout";
import CategoryContainer from "@/containers/CategoryContainer";

type CategoryPageProps = {
  searchParams: Promise<{
    fuelType?: string;
    q?: string;
    standard?: string;
    sort?: string;
    viscosity?: string;
  }>;
};

export default async function CategoryPage({ searchParams }: CategoryPageProps) {
  const {
    fuelType = "",
    q = "",
    standard = "",
    sort = "popular",
    viscosity = "",
  } = await searchParams;
  const searchedProducts = searchProducts(products, {
    keyword: q,
    fuelType,
    viscosity,
    standard,
  });
  const displayProducts = sortProducts(searchedProducts, sort);

  return (
    <PageLayout>
      <CategoryContainer totalCount={searchedProducts.length} showAllProducts>
        <AllProductGrid
          key={`${q}-${fuelType}-${viscosity}-${standard}-${sort}`}
          products={displayProducts}
        />
      </CategoryContainer>
    </PageLayout>
  );
}
