import type { Product, ProductBadge } from "@/assets/category/types";

export type ProductQueryParams = {
  category?: string;
  subCategory?: string;
  q?: string;
  fuelType?: string;
  viscosity?: string;
  standard?: string;
  sort?: string;
};

type ServerProduct = {
  productId: number;
  productName: string;
  category: string;
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
  mainProduct: boolean;
  recommended: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const categoryColors: Record<string, string> = {
  engine: "#b7bec7",
  mission: "#bf2331",
  brake: "#286c98",
  filter: "#d0a046",
  gear: "#a0a9b4",
  chemical: "#26709b",
};

const appendParam = (params: URLSearchParams, key: string, value?: string) => {
  if (value?.trim()) {
    params.set(key, value.trim());
  }
};

const resolveBadge = (product: ServerProduct): ProductBadge => {
  if (product.mainProduct) {
    return "BEST";
  }

  return product.recommended ? "HOT" : "BEST";
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
  if (specification.includes("dct")) return "dct";
  if (specification.includes("dot4")) return "dot-4";
  if (specification.includes("dot5.1")) return "dot-5-1";
  if (specification.includes("gl-5")) return "75w-90";
  if (productName.includes("오일필터")) return "oil-filter";
  if (productName.includes("에어필터")) return "air-filter";
  if (productName.includes("캐빈필터")) return "cabin-filter";
  if (productName.includes("첨가제") || productName.includes("불스원샷")) return "additive";
  if (productName.includes("냉각수") || productName.includes("쿨런트")) return "coolant";

  return product.category;
};

const toProduct = (product: ServerProduct): Product => ({
  id: product.productId,
  categorySlug: product.category,
  subCategorySlug: resolveSubCategorySlug(product),
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
  badge: resolveBadge(product),
  color: categoryColors[product.category] ?? "#b7bec7",
});

export const productApi = {
  findProducts: async (query: ProductQueryParams = {}) => {
    const params = new URLSearchParams();

    appendParam(params, "category", query.category);
    appendParam(params, "subCategory", query.subCategory);
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

    return products.map(toProduct);
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
