"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  type AdminOrder,
  type OrderStatus,
} from "@/components/admin/admin.api";

const ADMIN_ORDERS_QUERY_KEY = ["admin", "orders"] as const;

export function useAdminOrders(isEnabled: boolean) {
  return useQuery({
    queryKey: ADMIN_ORDERS_QUERY_KEY,
    queryFn: adminApi.findOrders,
    enabled: isEnabled,
  });
}

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, orderStatus }: { orderId: number; orderStatus: OrderStatus }) =>
      adminApi.updateOrderStatus(orderId, orderStatus),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<AdminOrder[]>(ADMIN_ORDERS_QUERY_KEY, (orders) =>
        orders?.map((order) =>
          order.orderId === updatedOrder.orderId ? updatedOrder : order,
        ) ?? [updatedOrder],
      );
    },
  });
}
