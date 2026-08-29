import type { AdminProduct, ProductStatus } from "@/components/admin/admin.api";
import { useMemo, useState } from "react";

export const useAdminProductFilters = (products: AdminProduct[]) => {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | "">("");

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return products.filter((product) => {
      const isMatchedKeyword = !normalizedKeyword
        || String(product.productId).includes(normalizedKeyword)
        || product.productName.toLowerCase().includes(normalizedKeyword)
        || product.brand.toLowerCase().includes(normalizedKeyword);
      const isMatchedCategory = !selectedCategory || product.category === selectedCategory;
      const isMatchedStatus = !selectedStatus || product.saleStatus === selectedStatus;

      return isMatchedKeyword && isMatchedCategory && isMatchedStatus;
    });
  }, [keyword, products, selectedCategory, selectedStatus]);

  return {
    filteredProducts,
    keyword,
    selectedCategory,
    selectedStatus,
    setKeyword,
    setSelectedCategory,
    setSelectedStatus,
  };
};
