import type { CartItem } from "@/components/cart/CartContext";
import { formatPrice } from "@/components/cart/cart.utils";
import Image from "next/image";

type OrderItemsSectionProps = {
  items: CartItem[];
};

export function OrderItemsSection({ items }: OrderItemsSectionProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#171611] p-5">
      <h2 className="text-lg font-black text-white">주문 상품</h2>
      {items.length > 0 ? (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item.cartId} className="grid grid-cols-[64px_1fr] gap-4 rounded-md bg-black/20 p-3">
              <div className="relative h-16 overflow-hidden rounded-md bg-white">
                <Image
                  src={item.product.imageUrl || "/product-images/oil-bottle.svg"}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{item.product.name}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {item.quantity}개 · {formatPrice(item.product.price)}
                </p>
                <p className="mt-2 text-sm font-black text-[#d6a84f]">
                  {formatPrice(item.totalPrice)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-white/10 px-4 py-10 text-center text-sm text-zinc-400">
          주문할 상품이 없습니다.
        </div>
      )}
    </div>
  );
}
