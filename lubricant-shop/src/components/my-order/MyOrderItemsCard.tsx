import { formatPrice } from "@/components/cart/cart.utils";
import type { MyOrderItem } from "@/components/order/order.api";

type MyOrderItemsCardProps = {
  items: MyOrderItem[];
};

export function MyOrderItemsCard({ items }: MyOrderItemsCardProps) {
  return (
    <section className="rounded-lg border border-[#dce2e8] bg-white p-6 shadow-[0_14px_30px_rgba(7,29,59,0.06)]">
      <h2 className="text-xl font-black text-[#071d3b]">주문 상품</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <article key={item.orderItemId} className="rounded-md border border-[#edf0f3] bg-[#f8fafc] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-black text-[#071d3b]">{item.productName}</p>
                <p className="mt-2 text-sm font-bold text-[#65717f]">
                  {item.quantity.toLocaleString("ko-KR")}개 · {formatPrice(item.price)}
                </p>
              </div>
              <p className="font-black text-[#071d3b]">{formatPrice(item.totalPrice)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
