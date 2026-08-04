"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  type AdminProduct,
  type ProductStatus,
} from "@/components/admin/admin.api";

const ADMIN_PRODUCTS_QUERY_KEY = ["admin", "products"] as const;

export function useAdminProducts(isEnabled: boolean) {
  return useQuery({
    queryKey: ADMIN_PRODUCTS_QUERY_KEY,
    queryFn: adminApi.findProducts,
    enabled: isEnabled,
  });
}

export function useUpdateAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      input,
    }: {
      productId: number;
      input: { stock: number; saleStatus: ProductStatus };
    }) => adminApi.updateProduct(productId, input),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData<AdminProduct[]>(ADMIN_PRODUCTS_QUERY_KEY, (products) =>
        products?.map((product) =>
          product.productId === updatedProduct.productId ? updatedProduct : product,
        ) ?? [updatedProduct],
      );
    },
  });
}
