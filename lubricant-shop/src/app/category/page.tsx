import AllProductGrid from "@/components/category/AllProductGrid";
import { productApi } from "@/components/category/product.api";
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
  const displayProducts = await productApi.findProducts({
    q,
    fuelType,
    viscosity,
    standard,
    sort,
  });

  return (
    <PageLayout>
      <CategoryContainer totalCount={displayProducts.length} showAllProducts>
        <AllProductGrid
          key={`${q}-${fuelType}-${viscosity}-${standard}-${sort}`}
          products={displayProducts}
        />
      </CategoryContainer>
    </PageLayout>
  );
}
