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
  type OrderPaymentCompleteResponse,
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
  const [completedPayment, setCompletedPayment] = useState<OrderPaymentCompleteResponse | null>(null);

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
      setCompletedPayment(null);
      setMessage("주문 데이터가 저장되었습니다. 테스트 결제를 진행해 주세요.");
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "주문 생성에 실패했습니다.");
    },
  });

  const completePaymentMutation = useMutation({
    mutationFn: orderApi.completeTestPayment,
    onSuccess: (payment) => {
      setCompletedPayment(payment);
      setMessage("테스트 결제가 완료되었습니다. 주문 상태와 재고가 반영되었습니다.");
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "테스트 결제 완료 처리에 실패했습니다.");
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

  const handleCompleteTestPayment = () => {
    if (!createdOrder) {
      return;
    }

    completePaymentMutation.mutate(createdOrder.orderId);
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
          completedPayment={completedPayment}
          message={message}
          isPaymentPending={completePaymentMutation.isPending}
          onCompleteTestPayment={handleCompleteTestPayment}
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
