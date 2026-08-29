import type { AdminProduct } from "@/components/admin/admin.api";
import type { AdminProductDraft } from "@/components/admin/product/AdminProductsTable";
import { useState } from "react";

export const useAdminProductDrafts = (products: AdminProduct[]) => {
  const [drafts, setDrafts] = useState<Record<number, AdminProductDraft>>({});

  const updateDraft = (productId: number, nextDraft: Partial<AdminProductDraft>) => {
    const product = products.find((item) => item.productId === productId);

    if (!product) {
      return;
    }

    setDrafts((prevDrafts) => ({
      ...prevDrafts,
      [productId]: {
        stock: prevDrafts[productId]?.stock ?? product.stock,
        saleStatus: prevDrafts[productId]?.saleStatus ?? product.saleStatus,
        ...nextDraft,
      },
    }));
  };

  const syncDraft = (product: AdminProduct) => {
    setDrafts((prevDrafts) => ({
      ...prevDrafts,
      [product.productId]: {
        stock: product.stock,
        saleStatus: product.saleStatus,
      },
    }));
  };

  return {
    drafts,
    syncDraft,
    updateDraft,
  };
};
