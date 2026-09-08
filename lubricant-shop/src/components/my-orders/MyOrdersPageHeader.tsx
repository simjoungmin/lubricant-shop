import type { AuthUser } from "@/components/auth/auth/auth.types";
import type { MyOrderSummary } from "@/components/order/order.api";
import Link from "next/link";
import { countOrdersByStatus, formatOrderPrice } from "./my-orders.utils";

type MyOrdersPageHeaderProps = {
  user: AuthUser;
  orders: MyOrderSummary[];
};

export function MyOrdersPageHeader({ user, orders }: MyOrdersPageHeaderProps) {
  const canceledCount = countOrdersByStatus(orders, "CANCELED");

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href="/my-page" className="text-sm font-bold text-[#65717f] transition hover:text-[#ff4b1f]">
            내 정보로 돌아가기
          </Link>
          <p className="mt-8 text-sm font-black text-[#ff4b1f]">MY PAGE</p>
          <h1 className="mt-3 text-4xl font-black text-[#071d3b]">주문 내역</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#65717f]">
            주문한 상품과 현재 처리 상태를 확인합니다.
          </p>
        </div>

        <div className="grid gap-4 rounded-lg border border-[#dde2e8] bg-white px-6 py-5 shadow-[0_16px_42px_rgba(7,29,59,0.06)] sm:grid-cols-4 lg:min-w-[560px]">
          <div className="sm:col-span-1">
            <p className="text-xs font-black text-[#65717f]">회원</p>
            <p className="mt-2 text-base font-black text-[#071d3b]">{user.name}</p>
          </div>
          <div>
            <p className="text-xs font-black text-[#65717f]">보유 적립금</p>
            <p className="mt-2 text-base font-black text-[#071d3b]">
              {formatOrderPrice(user.pointBalance)}
            </p>
          </div>
          <div>
            <p className="text-xs font-black text-[#65717f]">주문</p>
            <p className="mt-2 text-base font-black text-[#071d3b]">{orders.length}건</p>
          </div>
          <div>
            <p className="text-xs font-black text-[#65717f]">취소/반품</p>
            <p className="mt-2 text-base font-black text-[#071d3b]">{canceledCount}건</p>
          </div>
        </div>
      </div>
    </section>
  );
}
