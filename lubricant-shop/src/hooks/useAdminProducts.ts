"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  type AdminProductUpdateInput,
  type AdminProduct,
} from "@/components/admin/admin.api";

const ADMIN_PRODUCTS_QUERY_KEY = ["admin", "products"] as const;
const adminProductQueryKey = (productId: number) => ["admin", "products", productId] as const;

export function useAdminProducts(isEnabled: boolean) {
  return useQuery({
    queryKey: ADMIN_PRODUCTS_QUERY_KEY,
    queryFn: adminApi.findProducts,
    enabled: isEnabled,
  });
}

export function useAdminProduct(productId: number, isEnabled: boolean) {
  return useQuery({
    queryKey: adminProductQueryKey(productId),
    queryFn: () => adminApi.findProduct(productId),
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
      input: AdminProductUpdateInput;
    }) => adminApi.updateProduct(productId, input),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData<AdminProduct[]>(ADMIN_PRODUCTS_QUERY_KEY, (products) =>
        products?.map((product) =>
          product.productId === updatedProduct.productId ? updatedProduct : product,
        ) ?? [updatedProduct],
      );
      queryClient.setQueryData(adminProductQueryKey(updatedProduct.productId), updatedProduct);
    },
  });
}
