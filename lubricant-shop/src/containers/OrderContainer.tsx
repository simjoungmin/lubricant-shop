"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import OilHeader from "@/components/layout/OilHeader";
import {
  initialOrderFormState,
  OrderCompleteSection,
  type OrderFieldChangeHandler,
  type OrderFormState,
  OrderFormSection,
  OrderLoadingSection,
  OrderLoginRequiredSection,
  OrderPageFrame,
} from "@/components/order/OrderPageSections";
import {
  orderApi,
  type OrderCreateResponse,
} from "@/components/order/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

export default function OrderContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isReady } = useAuth();
  const { items, totalQuantity, totalPrice, expectedRewardPoint, isLoading } = useCart();
  const [form, setForm] = useState<OrderFormState>(() => ({
    ...initialOrderFormState,
    receiverName: user?.name ?? "",
  }));
  const [message, setMessage] = useState("");
  const [createdOrder, setCreatedOrder] = useState<OrderCreateResponse | null>(null);

  const pointBalance = user?.pointBalance ?? 0;
  const maxUsablePoint = Math.min(pointBalance, totalPrice);
  const usablePointAmount = form.usePoints
    ? Math.min(Math.max(0, form.pointAmount), maxUsablePoint)
    : 0;
  const previewPaymentAmount = totalPrice - usablePointAmount;

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    [items],
  );

  const createOrderMutation = useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: (order) => {
      setCreatedOrder(order);
      setMessage("주문이 접수되었습니다. 입금 확인 후 결제 완료로 변경됩니다.");
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "주문 생성에 실패했습니다.");
    },
  });

  const updateForm: OrderFieldChangeHandler = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const handlePointAmountChange = (value: string) => {
    const pointAmount = Number(value.replace(/[^0-9]/g, ""));
    updateForm("pointAmount", Number.isFinite(pointAmount) ? Math.min(pointAmount, maxUsablePoint) : 0);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      router.push("/login?redirect=%2Forder");
      return;
    }

    if (orderItems.length === 0) {
      setMessage("주문할 상품이 없습니다.");
      return;
    }

    if (!form.receiverName.trim() || !form.receiverPhone.trim() || !form.shippingAddress.trim()) {
      setMessage("수령인, 연락처, 배송지를 입력해 주세요.");
      return;
    }

    createOrderMutation.mutate({
      items: orderItems,
      receiverName: form.receiverName.trim(),
      receiverPhone: form.receiverPhone.trim(),
      shippingAddress: form.shippingAddress.trim(),
      deliveryRequest: form.deliveryRequest.trim(),
      paymentMethod: form.paymentMethod,
      usePoints: form.usePoints,
      pointAmount: usablePointAmount,
    });
  };

  const renderOrderContent = () => {
    if (!isReady || isLoading) {
      return <OrderLoadingSection />;
    }

    if (!user) {
      return <OrderLoginRequiredSection href="/login?redirect=%2Forder" />;
    }

    if (createdOrder) {
      return (
        <OrderCompleteSection
          createdOrder={createdOrder}
          message={message}
        />
      );
    }

    return (
      <OrderFormSection
        form={form}
        items={items}
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        expectedRewardPoint={expectedRewardPoint}
        pointBalance={pointBalance}
        usablePointAmount={usablePointAmount}
        previewPaymentAmount={previewPaymentAmount}
        message={message}
        isCreatePending={createOrderMutation.isPending}
        onSubmit={handleSubmit}
        onUpdateForm={updateForm}
        onPointAmountChange={handlePointAmountChange}
      />
    );
  };

  return (
    <>
      <OilHeader />
      <OrderPageFrame>{renderOrderContent()}</OrderPageFrame>
    </>
  );
}
