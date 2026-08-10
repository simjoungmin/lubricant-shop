"use client";

import type { PaymentMethod } from "@/components/admin/admin.api";
import type { CartItem } from "@/components/cart/CartContext";
import { formatPrice } from "@/components/cart/cart.utils";
import type {
  OrderCreateResponse,
  OrderPaymentCompleteResponse,
} from "@/components/order/order.api";
import Image from "next/image";
import Link from "next/link";
import type { FormEvent, ReactNode } from "react";

export type OrderFormState = {
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  deliveryRequest: string;
  paymentMethod: PaymentMethod;
  usePoints: boolean;
  pointAmount: number;
};

export type OrderFieldChangeHandler = <Field extends keyof OrderFormState>(
  field: Field,
  value: OrderFormState[Field],
) => void;

type OrderPageFrameProps = {
  children: ReactNode;
};

type OrderLoginRequiredProps = {
  href: string;
};

type OrderCompleteSectionProps = {
  createdOrder: OrderCreateResponse;
  completedPayment: OrderPaymentCompleteResponse | null;
  message: string;
  isPaymentPending: boolean;
  onCompleteTestPayment: () => void;
};

type OrderFormSectionProps = {
  form: OrderFormState;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  expectedRewardPoint: number;
  pointBalance: number;
  usablePointAmount: number;
  previewPaymentAmount: number;
  message: string;
  isCreatePending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateForm: OrderFieldChangeHandler;
  onPointAmountChange: (value: string) => void;
};

export const initialOrderFormState: OrderFormState = {
  receiverName: "",
  receiverPhone: "",
  shippingAddress: "",
  deliveryRequest: "",
  paymentMethod: "CARD",
  usePoints: false,
  pointAmount: 0,
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  CARD: "카드",
  BANK_TRANSFER: "무통장입금",
  VIRTUAL_ACCOUNT: "가상계좌",
  CASH: "현금",
};

const inputClassName =
  "h-11 rounded-md border border-white/10 bg-[#11100d] px-3 text-sm font-bold text-white outline-none transition focus:border-[#d6a84f]";

export function OrderPageFrame({ children }: OrderPageFrameProps) {
  return (
    <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[1180px] px-6 py-10 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black text-[#d6a84f]">ORDER</p>
        <h1 className="mt-3 text-3xl font-black text-white">주문서 작성</h1>
        <p className="mt-3 text-sm text-zinc-400">
          주문 정보를 확인하고 테스트 결제로 주문 상태와 재고 반영을 확인합니다.
        </p>
      </div>

      {children}
    </main>
  );
}

export function OrderLoadingSection() {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171611] px-6 py-16 text-center text-sm font-bold text-zinc-300">
      주문 정보를 불러오는 중입니다.
    </section>
  );
}

export function OrderLoginRequiredSection({ href }: OrderLoginRequiredProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
      <p className="text-sm font-bold text-zinc-300">
        로그인 후 주문서를 작성할 수 있습니다.
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
      >
        로그인하러 가기
      </Link>
    </section>
  );
}

export function OrderCompleteSection({
  createdOrder,
  completedPayment,
  message,
  isPaymentPending,
  onCompleteTestPayment,
}: OrderCompleteSectionProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-lg border border-white/10 bg-[#171611] p-6">
        <p className="text-sm font-black text-[#d6a84f]">주문 저장 완료</p>
        <h2 className="mt-3 text-2xl font-black text-white">{createdOrder.orderNumber}</h2>
        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>주문 상태</span>
            <strong className="text-white">
              {completedPayment?.orderStatus ?? createdOrder.orderStatus}
            </strong>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>상품 합계</span>
            <strong className="text-white">{formatPrice(createdOrder.totalOrderAmount)}</strong>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>사용 포인트</span>
            <strong className="text-white">{createdOrder.pointUsed.toLocaleString("ko-KR")} P</strong>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-zinc-300">
            <span className="font-black">결제 금액</span>
            <strong className="text-xl font-black text-[#d6a84f]">
              {formatPrice(completedPayment?.paymentAmount ?? createdOrder.paymentAmount)}
            </strong>
          </div>
        </div>

        {message ? (
          <p className="mt-5 rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-zinc-200">
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={Boolean(completedPayment) || isPaymentPending}
            className="h-12 rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            onClick={onCompleteTestPayment}
          >
            {isPaymentPending ? "처리 중..." : "테스트 결제 완료"}
          </button>
          <Link
            href={`/my-page/orders/${createdOrder.orderId}`}
            className="inline-flex h-12 items-center justify-center rounded-md border border-[#d6a84f]/70 px-5 text-sm font-black text-[#d6a84f] transition hover:bg-[#d6a84f] hover:text-black"
          >
            주문 상세 보기
          </Link>
          <Link
            href="/my-page/orders"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
          >
            주문 내역으로 이동
          </Link>
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-white/10 bg-[#171611] p-5">
        <h3 className="text-lg font-black text-white">다음 단계</h3>
        <div className="mt-4 space-y-3 text-sm text-zinc-400">
          <p>실제 PG 연동 시 이 위치에서 결제창 호출과 승인 API 처리가 들어갑니다.</p>
          <p>승인 성공 후 지금처럼 주문 상태와 재고를 변경합니다.</p>
        </div>
      </aside>
    </section>
  );
}

export function OrderFormSection({
  form,
  items,
  totalQuantity,
  totalPrice,
  expectedRewardPoint,
  pointBalance,
  usablePointAmount,
  previewPaymentAmount,
  message,
  isCreatePending,
  onSubmit,
  onUpdateForm,
  onPointAmountChange,
}: OrderFormSectionProps) {
  return (
    <form className="grid gap-6 lg:grid-cols-[1fr_380px]" onSubmit={onSubmit}>
      <section className="space-y-5">
        <div className="rounded-lg border border-white/10 bg-[#171611] p-5">
          <h2 className="text-lg font-black text-white">배송지 입력</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-zinc-200">
              수령인
              <input
                className={inputClassName}
                value={form.receiverName}
                onChange={(event) => onUpdateForm("receiverName", event.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-200">
              연락처
              <input
                className={inputClassName}
                inputMode="tel"
                placeholder="010-0000-0000"
                value={form.receiverPhone}
                onChange={(event) => onUpdateForm("receiverPhone", event.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-200">
              배송지
              <input
                className={inputClassName}
                placeholder="주소를 입력해 주세요"
                value={form.shippingAddress}
                onChange={(event) => onUpdateForm("shippingAddress", event.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-200">
              배송 요청사항
              <input
                className={inputClassName}
                placeholder="문 앞에 놓아주세요"
                value={form.deliveryRequest}
                onChange={(event) => onUpdateForm("deliveryRequest", event.target.value)}
              />
            </label>
          </div>
        </div>

        <OrderItemsSection items={items} />
      </section>

      <aside className="h-fit rounded-lg border border-white/10 bg-[#171611] p-5">
        <h2 className="text-lg font-black text-white">결제 정보</h2>
        <label className="mt-5 grid gap-2 text-sm font-bold text-zinc-200">
          결제수단
          <select
            className={inputClassName}
            value={form.paymentMethod}
            onChange={(event) => onUpdateForm("paymentMethod", event.target.value as PaymentMethod)}
          >
            {(Object.keys(paymentMethodLabel) as PaymentMethod[]).map((method) => (
              <option key={method} value={method}>
                {paymentMethodLabel[method]}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 rounded-md border border-white/10 bg-black/20 p-4">
          <label className="flex items-center justify-between gap-3 text-sm font-bold text-zinc-200">
            <span>포인트 사용</span>
            <input
              type="checkbox"
              checked={form.usePoints}
              disabled={pointBalance === 0 || totalQuantity === 0}
              onChange={(event) => onUpdateForm("usePoints", event.target.checked)}
            />
          </label>
          <div className="mt-2 flex justify-between text-xs font-bold text-zinc-500">
            <span>보유 포인트</span>
            <span>{pointBalance.toLocaleString("ko-KR")} P</span>
          </div>
          {form.usePoints ? (
            <input
              className={`${inputClassName} mt-3 w-full`}
              inputMode="numeric"
              value={form.pointAmount.toLocaleString("ko-KR")}
              onChange={(event) => onPointAmountChange(event.target.value)}
            />
          ) : null}
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>상품 수량</span>
            <strong className="text-white">{totalQuantity}개</strong>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>상품 합계</span>
            <strong className="text-white">{formatPrice(totalPrice)}</strong>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>포인트 할인</span>
            <strong className="text-white">-{usablePointAmount.toLocaleString("ko-KR")} P</strong>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>예상 적립</span>
            <strong className="text-[#d6a84f]">{expectedRewardPoint.toLocaleString("ko-KR")} P</strong>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-zinc-300">
            <span className="font-black">결제 예정</span>
            <strong className="text-xl font-black text-[#d6a84f]">
              {formatPrice(previewPaymentAmount)}
            </strong>
          </div>
        </div>

        {message ? (
          <p className="mt-5 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm font-bold text-zinc-200">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={items.length === 0 || isCreatePending}
          className="mt-5 h-12 w-full rounded-md bg-[#d6a84f] text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {isCreatePending ? "주문 저장 중..." : "주문 데이터 저장"}
        </button>
      </aside>
    </form>
  );
}

function OrderItemsSection({ items }: { items: CartItem[] }) {
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
