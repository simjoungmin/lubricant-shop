import { formatPrice } from "@/components/cart/cart.utils";
import type { MyOrderItem } from "@/components/order/order.api";

type MyOrderItemsCardProps = {
  items: MyOrderItem[];
};

export function MyOrderItemsCard({ items }: MyOrderItemsCardProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
      <h2 className="text-xl font-black text-white">주문 상품</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <article key={item.orderItemId} className="rounded-md bg-black/20 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-black text-white">{item.productName}</p>
                <p className="mt-2 text-sm font-bold text-zinc-500">
                  {item.quantity.toLocaleString("ko-KR")}개 · {formatPrice(item.price)}
                </p>
              </div>
              <p className="font-black text-zinc-200">{formatPrice(item.totalPrice)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
