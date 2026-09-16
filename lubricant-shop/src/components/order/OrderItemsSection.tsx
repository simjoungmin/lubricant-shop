import type { CartItem } from "@/components/cart/CartContext";
import { formatPrice } from "@/components/cart/cart.utils";
import { ProductImage, PRODUCT_IMAGE_SIZES } from "@/components/common/ProductImage";

type OrderItemsSectionProps = {
  items: CartItem[];
};

export function OrderItemsSection({ items }: OrderItemsSectionProps) {
  return (
    <div className="rounded-lg border border-[#dde2e8] bg-white p-5">
      <h2 className="text-lg font-black text-[#071d3b]">주문 상품</h2>
      {items.length > 0 ? (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div
              key={item.cartId}
              className="grid grid-cols-[64px_1fr] gap-4 rounded-md border border-[#edf0f3] bg-[#fbfcfd] p-3"
            >
              <div className="relative h-16 overflow-hidden rounded-md bg-white">
                <ProductImage
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  sizes={PRODUCT_IMAGE_SIZES.thumbnail}
                  className="object-contain p-2"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#071d3b]">{item.product.name}</p>
                <p className="mt-1 text-xs text-[#65717f]">
                  {item.quantity}개 · {formatPrice(item.product.price)}
                </p>
                <p className="mt-2 text-sm font-black text-[#ff4b1f]">
                  {formatPrice(item.totalPrice)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-[#cfd6de] px-4 py-10 text-center text-sm text-[#65717f]">
          주문할 상품이 없습니다.
        </div>
      )}
    </div>
  );
}
