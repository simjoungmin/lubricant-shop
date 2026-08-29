"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  type AdminOrder,
  type AdminOrderShipmentUpdateInput,
  type OrderStatus,
} from "@/components/admin/admin.api";

const ADMIN_ORDERS_QUERY_KEY = ["admin", "orders"] as const;
const adminOrderQueryKey = (orderId: number) => ["admin", "orders", orderId] as const;

export function useAdminOrders(isEnabled: boolean) {
  return useQuery({
    queryKey: ADMIN_ORDERS_QUERY_KEY,
    queryFn: adminApi.findOrders,
    enabled: isEnabled,
  });
}

export function useAdminOrder(orderId: number, isEnabled: boolean) {
  return useQuery({
    queryKey: adminOrderQueryKey(orderId),
    queryFn: () => adminApi.findOrder(orderId),
    enabled: isEnabled,
  });
}

const updateAdminOrderCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  updatedOrder: AdminOrder,
) => {
  queryClient.setQueryData<AdminOrder[]>(ADMIN_ORDERS_QUERY_KEY, (orders) =>
    orders?.map((order) =>
      order.orderId === updatedOrder.orderId ? updatedOrder : order,
    ) ?? [updatedOrder],
  );
  queryClient.setQueryData(adminOrderQueryKey(updatedOrder.orderId), updatedOrder);
};

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      orderStatus,
      shipment,
    }: {
      orderId: number;
      orderStatus: OrderStatus;
      shipment?: Partial<AdminOrderShipmentUpdateInput>;
    }) => adminApi.updateOrderStatus(orderId, orderStatus, shipment),
    onSuccess: (updatedOrder) => {
      updateAdminOrderCache(queryClient, updatedOrder);
    },
  });
}

export function useUpdateAdminOrderShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      input,
    }: {
      orderId: number;
      input: AdminOrderShipmentUpdateInput;
    }) => adminApi.updateOrderShipment(orderId, input),
    onSuccess: (updatedOrder) => {
      updateAdminOrderCache(queryClient, updatedOrder);
    },
  });
}

export function useCompleteAdminOrderPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => adminApi.completeOrderPayment(orderId),
    onSuccess: (updatedOrder) => {
      updateAdminOrderCache(queryClient, updatedOrder);
    },
  });
}
