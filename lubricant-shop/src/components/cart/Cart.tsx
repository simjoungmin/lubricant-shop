"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import CartToast from "@/components/cart/CartToast";
import { useCart } from "@/components/cart/CartContext";

const Cart = () => {
  const {
    items,
    totalQuantity,
    totalPrice,
    expectedRewardPoint,
    isCartOpen,
    isLoading,
    notice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    closeCart,
  } = useCart();

  return (
    <>
      <CartToast notice={notice} />
      {isCartOpen ? (
        <CartDrawer
          items={items}
          totalQuantity={totalQuantity}
          totalPrice={totalPrice}
          expectedRewardPoint={expectedRewardPoint}
          isLoading={isLoading}
          onClose={closeCart}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onRemove={removeFromCart}
        />
      ) : null}
    </>
  );
};

export default Cart;
