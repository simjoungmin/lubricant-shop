"use client";

import { formatPrice } from "@/components/cart/cart.utils";
import { PRODUCT_IMAGE_SIZES, ProductImage } from "@/components/common/ProductImage";
import OilHeader from "@/components/layout/OilHeader";
import { orderApi, type MyOrderDetail, type MyOrderItem } from "@/components/order/order.api";
import { paymentApi, type PaymentConfirmResponse } from "@/components/payment/payment.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

type PaymentSuccessContainerProps = {
  paymentKey?: string;
  orderId?: string;
  amount?: string;
};

export default function PaymentSuccessContainer({
  paymentKey,
  orderId,
  amount,
}: PaymentSuccessContainerProps) {
  const queryClient = useQueryClient();
  const hasRequested = useRef(false);
  const parsedAmount = useMemo(() => Number(amount), [amount]);
  const canConfirm = Boolean(paymentKey && orderId && Number.isInteger(parsedAmount) && parsedAmount >= 0);

  const confirmMutation = useMutation({
    mutationFn: paymentApi.confirmPayment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      void queryClient.invalidateQueries({ queryKey: ["my", "orders"] });
    },
  });
  const confirmedPayment = confirmMutation.data;
  const orderQuery = useQuery({
    queryKey: ["my", "orders", confirmedPayment?.orderId],
    queryFn: () => orderApi.findMyOrder(confirmedPayment?.orderId ?? 0),
    enabled: Boolean(confirmedPayment?.orderId),
  });

  useEffect(() => {
    if (!canConfirm || hasRequested.current || !paymentKey || !orderId) {
      return;
    }

    hasRequested.current = true;
    confirmMutation.mutate({
      paymentKey,
      orderId,
      amount: parsedAmount,
    });
  }, [canConfirm, confirmMutation, orderId, parsedAmount, paymentKey]);

  return (
    <>
      <OilHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 lg:py-16">
        {renderContent(
          canConfirm,
          confirmedPayment,
          orderQuery.data,
          confirmMutation.error,
          confirmMutation.isPending,
          orderQuery.isFetching,
        )}
      </main>
    </>
  );
}

function renderContent(
  canConfirm: boolean,
  payment: PaymentConfirmResponse | undefined,
  order: MyOrderDetail | undefined,
  error: Error | null,
  isPending: boolean,
  isOrderFetching: boolean,
) {
  if (!canConfirm) {
    return (
      <PaymentResult
        title="결제 정보를 확인할 수 없습니다."
        description="토스페이먼츠에서 전달된 승인 정보가 올바르지 않습니다."
        tone="error"
      />
    );
  }

  if (isPending || (!payment && !error)) {
    return (
      <PaymentResult
        title="결제를 승인하고 있습니다."
        description="주문 금액과 결제 정보를 확인하는 중입니다."
        tone="pending"
      />
    );
  }

  if (error) {
    return (
      <PaymentResult
        title="결제 승인에 실패했습니다."
        description={error.message}
        tone="error"
      />
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
          <div>
            <p className="text-sm font-black text-[#ff4b1f]">결제 완료</p>
            <h1 className="mt-3 text-2xl font-black text-[#071d3b]">{payment.orderNumber}</h1>
            <p className="mt-3 text-sm font-bold text-[#65717f]">
              결제가 정상 승인되었습니다. 주문 상품 준비가 시작됩니다.
            </p>
          </div>
          <dl className="grid gap-3 text-sm">
            <SummaryRow label="결제 상태" value="결제 완료" />
            <SummaryRow label="결제수단" value={payment.paymentMethod ?? "카드"} />
            <SummaryRow label="결제 금액" value={formatPrice(payment.paymentAmount)} />
          </dl>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/my-page/orders/${payment.orderId}`}
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#071d3b] px-5 text-sm font-black text-white transition hover:bg-[#12345f]"
          >
            주문 상세 보기
          </Link>
          <Link
            href="/my-page/orders"
            className="inline-flex h-12 items-center justify-center rounded-md border border-[#aab3bf] bg-white px-5 text-sm font-black text-[#071d3b] transition hover:border-[#ff4b1f] hover:text-[#ff4b1f]"
          >
            주문 내역으로 이동
          </Link>
        </div>

        <div className="border-t border-[#edf0f3] pt-6">
          <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-[#071d3b]">주문 상품</h2>
          {isOrderFetching ? <span className="text-xs font-bold text-[#65717f]">불러오는 중</span> : null}
          </div>
          {order?.items.length ? (
            <div className="mt-5 grid gap-3">
              {order.items.map((item) => (
                <PaymentOrderItem key={item.orderItemId} item={item} />
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-md border border-[#edf0f3] bg-[#f8fafc] px-4 py-3 text-sm font-bold text-[#65717f]">
              주문 상품 정보를 불러오고 있습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function PaymentOrderItem({ item }: { item: MyOrderItem }) {
  return (
    <article className="rounded-md border border-[#edf0f3] bg-[#f8fafc] p-4">
      <div className="grid gap-4 sm:grid-cols-[88px_1fr_auto] sm:items-center">
        <div className="relative h-24 w-24 overflow-hidden rounded-md border border-[#e2e6eb] bg-white sm:h-[88px] sm:w-[88px]">
          <ProductImage
            src={item.imageUrl}
            alt={item.productName}
            sizes={PRODUCT_IMAGE_SIZES.cart}
          />
        </div>
        <div>
          <p className="font-black text-[#071d3b]">{item.productName}</p>
          <p className="mt-2 text-sm font-bold text-[#65717f]">
            {item.quantity.toLocaleString("ko-KR")}개 · {formatPrice(item.price)}
          </p>
          <p className="mt-1 text-xs font-bold text-[#ff4b1f]">
            적립 예정 {item.pointEarned.toLocaleString("ko-KR")} P
          </p>
        </div>
        <p className="text-left font-black text-[#071d3b] sm:text-right">{formatPrice(item.totalPrice)}</p>
      </div>
    </article>
  );
}

function PaymentResult({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: "pending" | "error";
}) {
  const toneClassName = tone === "error" ? "text-[#ff4b1f]" : "text-[#071d3b]";

  return (
    <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
      <p className={`text-sm font-black ${toneClassName}`}>{tone === "error" ? "승인 실패" : "승인 진행"}</p>
      <h1 className="mt-3 text-2xl font-black text-[#071d3b]">{title}</h1>
      <p className="mt-4 text-sm font-bold leading-6 text-[#65717f]">{description}</p>
      {tone === "error" ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/order"
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#071d3b] px-5 text-sm font-black text-white transition hover:bg-[#12345f]"
          >
            주문으로 돌아가기
          </Link>
          <Link
            href="/my-page/orders"
            className="inline-flex h-12 items-center justify-center rounded-md border border-[#aab3bf] bg-white px-5 text-sm font-black text-[#071d3b] transition hover:border-[#ff4b1f] hover:text-[#ff4b1f]"
          >
            주문 내역 확인
          </Link>
        </div>
      ) : null}
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-[#65717f]">
      <dt>{label}</dt>
      <dd className="font-black text-[#071d3b]">{value}</dd>
    </div>
  );
}
