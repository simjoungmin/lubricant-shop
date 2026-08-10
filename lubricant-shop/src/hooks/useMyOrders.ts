"use client";

import { orderApi } from "@/components/order/order.api";
import { useQuery } from "@tanstack/react-query";

const MY_ORDERS_QUERY_KEY = ["my", "orders"] as const;

export function useMyOrders(isEnabled: boolean) {
  return useQuery({
    queryKey: MY_ORDERS_QUERY_KEY,
    queryFn: orderApi.findMyOrders,
    enabled: isEnabled,
  });
}

export function useMyOrder(orderId: number, isEnabled: boolean) {
  return useQuery({
    queryKey: [...MY_ORDERS_QUERY_KEY, orderId],
    queryFn: () => orderApi.findMyOrder(orderId),
    enabled: isEnabled,
  });
}
