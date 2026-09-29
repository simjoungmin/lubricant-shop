import CategoryProductGrid from "@/components/category/CategoryProductGrid";
import { productApi } from "@/components/category/product.api";

const brandEngineOilBrands = [
  "GS 킥스",
  "SK 지크",
  "쉘",
  "에쓰오일",
  "캐스트롤",
  "현대오일뱅크",
  "77루브리컨츠",
  "GRO",
  "그랜빌",
  "라프렌졸",
  "루벡스",
  "부두라이드",
  "부스터",
  "비톨",
  "실버이글",
  "앱솔",
  "익스트림",
  "지에너지",
  "케놀",
  "코프란",
];

const viscosityEngineOilViscosities = [
  "0W20",
  "0W30",
  "0W40",
  "5W20",
  "5W30",
  "5W40",
  "5W50",
  "5W60",
  "10W30",
  "10W60",
];

const gasolineLpgEngineOilBrands = [
  "GS 킥스",
  "SK 지크",
  "쉘",
  "캐스트롤",
  "현대오일뱅크",
  "77루브리컨츠",
  "GRO",
  "그랜빌",
  "라프렌졸",
  "루벡스",
  "부두라이드",
  "부스터",
  "비톨",
  "실버이글",
  "앱솔",
  "익스트림",
  "케놀",
  "코프란",
];

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
  const shouldShowGasolineLpgBrandFilter =
    category === "engine" && subCategory === "gasoline-lpg-engine-oil";
  const shouldShowPassengerDieselBrandFilter =
    category === "engine" && subCategory === "passenger-diesel-engine-oil";
  const shouldShowViscosityFilter =
    category === "engine" && subCategory === "viscosity-engine-oil";
  const fetchedBrandOptions = shouldShowBrandFilter
    ? await productApi.findBrands({
        category,
        subCategory,
        q,
        fuelType,
        viscosity,
        standard,
      })
    : [];
  const brandOptions = shouldShowBrandFilter
    ? [...new Set([...brandEngineOilBrands, ...fetchedBrandOptions])]
    : shouldShowGasolineLpgBrandFilter || shouldShowPassengerDieselBrandFilter
      ? gasolineLpgEngineOilBrands
      : fetchedBrandOptions;
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
      viscosityOptions={
        shouldShowViscosityFilter ? viscosityEngineOilViscosities : []
      }
      selectedViscosity={viscosity}
    />
  );
}
