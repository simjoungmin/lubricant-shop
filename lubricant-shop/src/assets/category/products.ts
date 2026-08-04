import type { Product, ProductFuelType, ProductSearchFilters } from "./types";

export type ProductSort = "popular" | "price-low" | "price-high";

type ProductSearchMeta = {
  fuelTypes?: ProductFuelType[];
  standard?: string;
};

const productSearchMetaById: Record<number, ProductSearchMeta> = {
  1: { fuelTypes: ["gasoline", "diesel", "europe"], standard: "acea" },
  2: { fuelTypes: ["gasoline"], standard: "api" },
  3: { fuelTypes: ["gasoline", "diesel"], standard: "api" },
  4: { fuelTypes: ["gasoline"], standard: "api" },
  5: { fuelTypes: ["gasoline", "europe"], standard: "acea" },
  6: { fuelTypes: ["gasoline"], standard: "api" },
  7: { fuelTypes: ["diesel"], standard: "api" },
  8: { fuelTypes: ["gasoline", "hybrid"], standard: "api" },
  11: { standard: "atf" },
  12: { standard: "atf" },
  13: { standard: "cvt" },
  14: { standard: "dct" },
  21: { standard: "dot-4" },
  22: { standard: "dot-4" },
  23: { standard: "dot-5-1" },
  31: { standard: "oil-filter" },
  32: { standard: "air-filter" },
  33: { standard: "cabin-filter" },
  41: { standard: "gl-5" },
  42: { standard: "gl-5" },
  43: { standard: "gl-5" },
  51: { standard: "additive" },
  52: { fuelTypes: ["gasoline"], standard: "additive" },
  53: { standard: "coolant" },
};

export const products: Product[] = [
  { id: 1, categorySlug: "engine", subCategorySlug: "5w-30", name: "모빌원 ESP 5W-30", spec: "100% 합성유 1L", price: 18000, badge: "BEST", color: "#b7bec7" },
  { id: 2, categorySlug: "engine", subCategorySlug: "5w-30", name: "킥스 PAO 10W-30", spec: "100% 합성유 1L", price: 19500, badge: "HOT", color: "#f0b323" },
  { id: 3, categorySlug: "engine", subCategorySlug: "5w-30", name: "쉘 헬릭스 울트라 5W-30", spec: "100% 합성유 1L", price: 16500, badge: "HOT", color: "#f2b51d" },
  { id: 4, categorySlug: "engine", subCategorySlug: "5w-30", name: "토탈 쿼츠 9000 5W-30", spec: "100% 합성유 1L", price: 17000, badge: "HOT", color: "#1d1d1f" },
  { id: 5, categorySlug: "engine", subCategorySlug: "5w-40", name: "모빌원 FS 0W-40", spec: "100% 합성유 1L", price: 22000, badge: "BEST", color: "#aeb7c1" },
  { id: 6, categorySlug: "engine", subCategorySlug: "5w-40", name: "킥스 G1 5W-30", spec: "100% 합성유 1L", price: 15500, badge: "BEST", color: "#e9aa12" },
  { id: 7, categorySlug: "engine", subCategorySlug: "10w-40", name: "쉘 헬릭스 HX7 10W-40", spec: "합성유 1L", price: 12500, badge: "BEST", color: "#0f7c9f" },
  { id: 8, categorySlug: "engine", subCategorySlug: "0w-20", name: "토탈 쿼츠 9000 0W-20", spec: "100% 합성유 1L", price: 16000, badge: "BEST", color: "#151515" },
  { id: 11, categorySlug: "mission", subCategorySlug: "atf", name: "캐스트롤 ATF 멀티 차량용", spec: "자동변속기유 1L", price: 13500, badge: "BEST", color: "#bf2331" },
  { id: 12, categorySlug: "mission", subCategorySlug: "atf", name: "킥스 ATF DX-III", spec: "자동변속기유 1L", price: 8900, badge: "HOT", color: "#e89921" },
  { id: 13, categorySlug: "mission", subCategorySlug: "cvt", name: "모빌 ATF 3309", spec: "CVT 호환 1L", price: 14000, badge: "BEST", color: "#7a8798" },
  { id: 14, categorySlug: "mission", subCategorySlug: "dct", name: "토탈 플루이드매틱 MV", spec: "DCT 오일 1L", price: 12000, badge: "HOT", color: "#222227" },
  { id: 21, categorySlug: "brake", subCategorySlug: "dot-4", name: "보쉬 브레이크액 DOT4", spec: "브레이크액 1L", price: 9800, badge: "BEST", color: "#286c98" },
  { id: 22, categorySlug: "brake", subCategorySlug: "dot-4", name: "ATE 브레이크 플루이드", spec: "DOT4 1L", price: 11000, badge: "HOT", color: "#eab326" },
  { id: 23, categorySlug: "brake", subCategorySlug: "dot-5-1", name: "모튤 RBF 600", spec: "DOT 5.1 500ml", price: 24000, badge: "BEST", color: "#d33a2d" },
  { id: 31, categorySlug: "filter", subCategorySlug: "oil-filter", name: "만필터 오일필터", spec: "차종별 호환", price: 7500, badge: "BEST", color: "#d0a046" },
  { id: 32, categorySlug: "filter", subCategorySlug: "air-filter", name: "보쉬 에어필터", spec: "차종별 호환", price: 12000, badge: "HOT", color: "#2c6a98" },
  { id: 33, categorySlug: "filter", subCategorySlug: "cabin-filter", name: "덴소 캐빈필터", spec: "초미세먼지 대응", price: 18000, badge: "BEST", color: "#869098" },
  { id: 41, categorySlug: "gear", subCategorySlug: "75w-90", name: "모빌루브 1 SHC 75W-90", spec: "기어오일 1L", price: 23000, badge: "BEST", color: "#a0a9b4" },
  { id: 42, categorySlug: "gear", subCategorySlug: "80w-90", name: "킥스 기어오일 80W-90", spec: "기어오일 1L", price: 8500, badge: "HOT", color: "#d7951d" },
  { id: 43, categorySlug: "gear", subCategorySlug: "85w-140", name: "토탈 트랜스미션 85W-140", spec: "기어오일 1L", price: 10000, badge: "BEST", color: "#202025" },
  { id: 51, categorySlug: "chemical", subCategorySlug: "additive", name: "리퀴몰리 엔진 플러시", spec: "엔진 첨가제 300ml", price: 16000, badge: "HOT", color: "#26709b" },
  { id: 52, categorySlug: "chemical", subCategorySlug: "additive", name: "불스원샷 연료첨가제", spec: "가솔린 500ml", price: 14900, badge: "BEST", color: "#d0332e" },
  { id: 53, categorySlug: "chemical", subCategorySlug: "coolant", name: "쿨런트 부스터", spec: "냉각수 첨가제 300ml", price: 12500, badge: "BEST", color: "#1c8c7a" },
];

export const getProductsByCategory = (categorySlug: string) =>
  products.filter((product) => product.categorySlug === categorySlug);

export const getProductsBySubCategory = (
  categorySlug: string,
  subCategorySlug: string,
) =>
  products.filter(
    (product) =>
      product.categorySlug === categorySlug &&
      product.subCategorySlug === subCategorySlug,
  );

export const sortProducts = (products: Product[], sort: string) => {
  if (sort === "price-low") {
    return [...products].sort((a, b) => a.price - b.price);
  }

  if (sort === "price-high") {
    return [...products].sort((a, b) => b.price - a.price);
  }

  return products;
};

const getProductViscosity = (product: Product) => {
  const viscosity = product.subCategorySlug.match(/\d+w-\d+/i)?.[0];

  return viscosity?.toLowerCase() ?? "";
};

const isProductMatchedByKeyword = (product: Product, keyword: string) => {
  const query = keyword.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const searchableText = `${product.name} ${product.spec} ${product.subCategorySlug}`.toLowerCase();

  return searchableText.includes(query);
};

export const searchProducts = (
  products: Product[],
  filters: ProductSearchFilters | string,
) => {
  const normalizedFilters =
    typeof filters === "string" ? { keyword: filters } : filters;
  const keyword = normalizedFilters.keyword ?? "";
  const fuelType = normalizedFilters.fuelType ?? "";
  const viscosity = normalizedFilters.viscosity?.toLowerCase() ?? "";
  const standard = normalizedFilters.standard ?? "";

  return products.filter((product) => {
    const metadata = productSearchMetaById[product.id];

    if (!isProductMatchedByKeyword(product, keyword)) {
      return false;
    }

    if (fuelType && !metadata?.fuelTypes?.includes(fuelType as ProductFuelType)) {
      return false;
    }

    if (viscosity && getProductViscosity(product) !== viscosity) {
      return false;
    }

    if (standard && metadata?.standard !== standard) {
      return false;
    }

    return true;
  });
};

export const getDisplayProducts = (
  products: Product[],
  sort: string,
  pageSize: string,
  filters: ProductSearchFilters | string = "",
) => {
  const parsedPageSize = Number(pageSize);
  const visibleCount = Number.isFinite(parsedPageSize) ? parsedPageSize : 20;

  return sortProducts(searchProducts(products, filters), sort).slice(0, visibleCount);
};
