"use client";

import type { Product } from "@/assets/category/types";
import { useAuth } from "@/components/auth/auth/AuthContext";
import { cartApi, type CartItem } from "@/components/cart/cart.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

export type { CartItem } from "@/components/cart/cart.api";

type CartState = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  expectedRewardPoint: number;
};

type CartContextValue = CartState & {
  isCartOpen: boolean;
  isLoading: boolean;
  notice: string | null;

  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  increaseQuantity: (cartId: number) => void;
  decreaseQuantity: (cartId: number) => void;
  removeFromCart: (cartId: number) => void;
  clearCart: () => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const emptyCart: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  expectedRewardPoint: 0,
};

const cartQueryKey = ["cart"];
const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isReady } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const isLoggedIn = Boolean(user);

  const cartQuery = useQuery({
    queryKey: cartQueryKey,
    queryFn: cartApi.findCart,
    enabled: isReady && isLoggedIn,
  });

  const cart = cartQuery.data ?? emptyCart;

  const redirectToLogin = () => {
    const currentPath =
      typeof window === "undefined"
        ? "/"
        : `${window.location.pathname}${window.location.search}`;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const updateCartCache = (nextCart: CartState) => {
    queryClient.setQueryData(cartQueryKey, nextCart);
  };

  const showCartError = (error: unknown, fallbackMessage: string) => {
    setNotice(error instanceof Error ? error.message : fallbackMessage);
  };

  const addItemMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartApi.addItem(productId, quantity),
    onSuccess: updateCartCache,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartId, quantity }: { cartId: number; quantity: number }) =>
      cartApi.updateQuantity(cartId, quantity),
    onSuccess: updateCartCache,
    onError: (error) => showCartError(error, "장바구니 수량 변경에 실패했습니다."),
  });

  const removeItemMutation = useMutation({
    mutationFn: (cartId: number) => cartApi.removeItem(cartId),
    onSuccess: updateCartCache,
    onError: (error) => showCartError(error, "장바구니 상품 삭제에 실패했습니다."),
  });

  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: updateCartCache,
    onError: (error) => showCartError(error, "장바구니 비우기에 실패했습니다."),
  });

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      queryClient.setQueryData(cartQueryKey, emptyCart);
    }
  }, [isLoggedIn, isReady, queryClient]);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => {
      setNotice(null);
    }, 1800);

    return () => clearTimeout(timer);
  }, [notice]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (product.saleStatus && product.saleStatus !== "ON_SALE") {
      setNotice("현재 구매할 수 없는 상품입니다.");
      return false;
    }

    if (product.stock !== undefined && product.stock <= 0) {
      setNotice("품절된 상품입니다.");
      return false;
    }

    if (!isLoggedIn) {
      redirectToLogin();
      return false;
    }

    try {
      await addItemMutation.mutateAsync({
        productId: product.id,
        quantity: Math.max(1, quantity),
      });
      setNotice(`${product.name} 상품이 장바구니에 담겼습니다.`);
      setIsCartOpen(true);

      return true;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "장바구니 담기에 실패했습니다.");

      return false;
    }
  };

  const increaseQuantity = (cartId: number) => {
    const item = cart.items.find((cartItem) => cartItem.cartId === cartId);

    if (!item) {
      return;
    }

    if (item.quantity >= item.product.stock) {
      setNotice("장바구니 수량이 현재 재고보다 많습니다.");
      return;
    }

    updateQuantityMutation.mutate({
      cartId,
      quantity: item.quantity + 1,
    });
  };

  const decreaseQuantity = (cartId: number) => {
    const item = cart.items.find((cartItem) => cartItem.cartId === cartId);

    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
      removeItemMutation.mutate(cartId);
      return;
    }

    updateQuantityMutation.mutate({
      cartId,
      quantity: item.quantity - 1,
    });
  };

  const removeFromCart = (cartId: number) => {
    removeItemMutation.mutate(cartId);
  };

  const clearCart = () => {
    if (cart.totalQuantity === 0) {
      return;
    }

    clearCartMutation.mutate();
  };

  const openCart = () => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    setIsCartOpen(true);
  };

  const value: CartContextValue = {
    ...cart,
    isCartOpen: isLoggedIn && isCartOpen,
    isLoading: cartQuery.isFetching,
    notice,

    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,

    openCart,
    closeCart: () => setIsCartOpen(false),
    toggleCart: () => {
      if (isCartOpen) {
        setIsCartOpen(false);
        return;
      }

      openCart();
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart는 CartProvider 안에서 사용해야 합니다.");
  }

  return context;
};
