import type { Product, ProductBadge } from "@/assets/category/types";
import { toProduct, type ServerProduct } from "@/components/category/product.api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type DisplaySectionResponse = {
  sectionId: number;
  sectionCode: string;
  sectionName: string;
  displayOrder: number;
  products: ServerProduct[];
};

export type DisplaySection = {
  sectionId: number;
  sectionCode: ProductBadge;
  sectionName: string;
  displayOrder: number;
  products: Product[];
};

const toProductBadge = (sectionCode: string): ProductBadge =>
  sectionCode === "HOT" ? "HOT" : "BEST";

const toDisplaySection = (section: DisplaySectionResponse): DisplaySection => {
  const sectionCode = toProductBadge(section.sectionCode);

  return {
    sectionId: section.sectionId,
    sectionCode,
    sectionName: section.sectionName,
    displayOrder: section.displayOrder,
    products: section.products.map((product) => toProduct(product, sectionCode)),
  };
};

export const displayApi = {
  findSections: async () => {
    const response = await fetch(`${API_BASE_URL}/api/display-sections`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("메인 진열 상품을 불러오지 못했습니다.");
    }

    const sections = (await response.json()) as DisplaySectionResponse[];

    return sections.map(toDisplaySection);
  },
};
