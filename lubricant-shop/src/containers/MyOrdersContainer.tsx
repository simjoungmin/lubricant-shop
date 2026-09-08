"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import OilHeader from "@/components/layout/OilHeader";
import { MyOrdersFilterBar } from "@/components/my-orders/MyOrdersFilterBar";
import { MyOrdersGuide } from "@/components/my-orders/MyOrdersGuide";
import { MyOrdersPageHeader } from "@/components/my-orders/MyOrdersPageHeader";
import { MyOrdersStateSection } from "@/components/my-orders/MyOrdersStateSection";
import { MyOrdersTabs } from "@/components/my-orders/MyOrdersTabs";
import { PreviousOrdersTable } from "@/components/my-orders/PreviousOrdersTable";
import { RecentOrderCard } from "@/components/my-orders/RecentOrderCard";
import { useMyOrders } from "@/hooks/useMyOrders";

export default function MyOrdersContainer() {
  const { user, isReady } = useAuth();
  const ordersQuery = useMyOrders(isReady && Boolean(user));
  const orders = ordersQuery.data ?? [];
  const recentOrder = orders[0];
  const previousOrders = orders.slice(1);

  const guardMessage = !isReady
    ? "주문 내역을 불러오는 중입니다."
    : !user
      ? "로그인 후 주문 내역을 확인할 수 있습니다."
      : ordersQuery.isPending
        ? "주문 내역을 불러오는 중입니다."
        : ordersQuery.isError
          ? ordersQuery.error.message
          : orders.length === 0
            ? "아직 주문 내역이 없습니다."
            : "";

  return (
    <>
      <OilHeader />

      <main className="min-h-[calc(100vh-64px)] bg-[#f7f7f5] text-[#071d3b]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-6 py-12 lg:px-8">
          {user ? (
            <>
              <MyOrdersPageHeader user={user} orders={orders} />
              <MyOrdersTabs orderCount={orders.length} />
            </>
          ) : null}

          {guardMessage ? (
            <MyOrdersStateSection message={guardMessage} shouldShowLoginLink={isReady && !user} />
          ) : null}

          {recentOrder ? (
            <>
              <MyOrdersFilterBar />
              <RecentOrderCard order={recentOrder} />
              <PreviousOrdersTable orders={previousOrders} />
              <MyOrdersGuide />
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
