import type { Product, ProductBadge } from "@/assets/category/types";

export type ProductQueryParams = {
  category?: string;
  subCategory?: string;
  brand?: string;
  q?: string;
  fuelType?: string;
  viscosity?: string;
  standard?: string;
  sort?: string;
};

export type ServerProduct = {
  productId: number;
  productName: string;
  category: string;
  subCategory: string | null;
  brand: string;
  price: number;
  originalPrice: number;
  discountPrice: number | null;
  stock: number;
  productDescription: string | null;
  viscosity: string | null;
  specification: string | null;
  volume: string | null;
  imageUrl: string | null;
  saleStatus: "ON_SALE" | "SOLD_OUT" | "STOPPED" | "HIDDEN";
  pointRewardRatePercent: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const categoryColors: Record<string, string> = {
  engine: "#b7bec7",
  mission: "#bf2331",
  gear: "#a0a9b4",
  "brake-power": "#286c98",
  coolant: "#26709b",
  chemical: "#26709b",
};

const appendParam = (params: URLSearchParams, key: string, value?: string) => {
  if (value?.trim()) {
    params.set(key, value.trim());
  }
};

const resolveSubCategorySlug = (product: ServerProduct) => {
  const viscosity = product.viscosity?.toLowerCase();

  if (viscosity) {
    return viscosity;
  }

  const specification = product.specification?.toLowerCase().replace(/\s/g, "") ?? "";
  const productName = product.productName.replace(/\s/g, "");

  if (specification.includes("atf")) return "atf";
  if (specification.includes("cvt")) return "cvt";
  if (specification.includes("dct") || specification.includes("dctf")) return "dct-dctf";
  if (specification.includes("dot") || productName.includes("브레이크액")) return "brake-fluid";
  if (productName.includes("파워오일")) return "power-oil";
  if (specification.includes("gl-5") || productName.includes("기어오일")) return "gear-oil";
  if (productName.includes("트랜스퍼케이스")) return "transfer-case";
  if (productName.includes("할덱스")) return "haldex";
  if (productName.includes("녹색")) return "green";
  if (productName.includes("청색")) return "blue";
  if (productName.includes("주황색") || productName.includes("분홍색")) return "orange-pink";
  if (productName.includes("황색")) return "yellow";
  if (productName.includes("적색")) return "red";
  if (productName.includes("미션첨가제")) return "mission-additive";
  if (productName.includes("방청유") || productName.includes("세정제")) return "rustproof-cleaner";
  if (productName.includes("워셔액")) return "washer-fluid";
  if (productName.includes("유압유")) return "hydraulic-oil";
  if (productName.includes("그리스")) return "grease";
  if (productName.includes("에어컨") || productName.includes("라디에이터")) return "aircon-radiator";
  if (productName.includes("첨가제") || productName.includes("불스원샷")) return "engine-system";

  return product.category;
};

export const toProduct = (product: ServerProduct, badge: ProductBadge = "BEST"): Product => ({
  id: product.productId,
  categorySlug: product.category,
  subCategorySlug: product.subCategory ?? resolveSubCategorySlug(product),
  name: product.productName,
  spec: [product.specification, product.volume].filter(Boolean).join(" / "),
  price: Number(product.price),
  originalPrice: Number(product.originalPrice),
  brand: product.brand,
  stock: product.stock,
  description: product.productDescription ?? "",
  viscosity: product.viscosity ?? "",
  specification: product.specification ?? "",
  volume: product.volume ?? "",
  imageUrl: product.imageUrl ?? "",
  saleStatus: product.saleStatus,
  pointRewardRatePercent: Number(product.pointRewardRatePercent),
  badge,
  color: categoryColors[product.category] ?? "#b7bec7",
});

export const productApi = {
  findProducts: async (query: ProductQueryParams = {}) => {
    const params = new URLSearchParams();

    appendParam(params, "category", query.category);
    appendParam(params, "subCategory", query.subCategory);
    appendParam(params, "brand", query.brand);
    appendParam(params, "q", query.q);
    appendParam(params, "fuelType", query.fuelType);
    appendParam(params, "viscosity", query.viscosity);
    appendParam(params, "standard", query.standard);
    appendParam(params, "sort", query.sort);

    const queryString = params.toString();
    const response = await fetch(
      `${API_BASE_URL}/api/products${queryString ? `?${queryString}` : ""}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("상품 목록을 불러오지 못했습니다.");
    }

    const products = (await response.json()) as ServerProduct[];

    return products.map((product) => toProduct(product));
  },

  findBrands: async (query: Omit<ProductQueryParams, "brand" | "sort"> = {}) => {
    const params = new URLSearchParams();

    appendParam(params, "category", query.category);
    appendParam(params, "subCategory", query.subCategory);
    appendParam(params, "q", query.q);
    appendParam(params, "fuelType", query.fuelType);
    appendParam(params, "viscosity", query.viscosity);
    appendParam(params, "standard", query.standard);

    const queryString = params.toString();
    const response = await fetch(
      `${API_BASE_URL}/api/products/brands${queryString ? `?${queryString}` : ""}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("브랜드 목록을 불러오지 못했습니다.");
    }

    return (await response.json()) as string[];
  },

  findProduct: async (productId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("상품 정보를 불러오지 못했습니다.");
    }

    const product = (await response.json()) as ServerProduct;

    return toProduct(product);
  },
};
