import type { PaymentMethod } from "@/components/admin/admin.api";
import { formatPrice } from "@/components/cart/cart.utils";
import { paymentMethodLabel } from "@/components/order/PaymentMethodFields";
import {
  type OrderFieldChangeHandler,
  type OrderFormState,
  orderInputClassName,
} from "@/components/order/order-form.types";

type OrderPaymentSummaryProps = {
  form: OrderFormState;
  totalQuantity: number;
  totalPrice: number;
  expectedRewardPoint: number;
  pointBalance: number;
  usablePointAmount: number;
  previewPaymentAmount: number;
  message: string;
  isCreatePending: boolean;
  itemCount: number;
  onUpdateForm: OrderFieldChangeHandler;
  onPointAmountChange: (value: string) => void;
};

export function OrderPaymentSummary({
  form,
  totalQuantity,
  totalPrice,
  expectedRewardPoint,
  pointBalance,
  usablePointAmount,
  previewPaymentAmount,
  message,
  isCreatePending,
  itemCount,
  onUpdateForm,
  onPointAmountChange,
}: OrderPaymentSummaryProps) {
  return (
    <aside className="h-fit rounded-lg border border-white/10 bg-[#171611] p-5">
      <h2 className="text-lg font-black text-white">결제 정보</h2>
      <label className="mt-5 grid gap-2 text-sm font-bold text-zinc-200">
        결제수단
        <select
          className={orderInputClassName}
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

      <PointUsageBox
        form={form}
        pointBalance={pointBalance}
        totalQuantity={totalQuantity}
        onUpdateForm={onUpdateForm}
        onPointAmountChange={onPointAmountChange}
      />

      <div className="mt-5 space-y-3 text-sm">
        <SummaryRow label="상품 수량" value={`${totalQuantity}개`} />
        <SummaryRow label="상품 합계" value={formatPrice(totalPrice)} />
        <SummaryRow label="포인트 할인" value={`-${usablePointAmount.toLocaleString("ko-KR")} P`} />
        <SummaryRow label="예상 적립" value={`${expectedRewardPoint.toLocaleString("ko-KR")} P`} isHighlight />
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
        disabled={itemCount === 0 || isCreatePending}
        className="mt-5 h-12 w-full rounded-md bg-[#d6a84f] text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
      >
        {isCreatePending ? "주문 저장 중..." : "주문 데이터 저장"}
      </button>
    </aside>
  );
}

function PointUsageBox({
  form,
  pointBalance,
  totalQuantity,
  onUpdateForm,
  onPointAmountChange,
}: {
  form: OrderFormState;
  pointBalance: number;
  totalQuantity: number;
  onUpdateForm: OrderFieldChangeHandler;
  onPointAmountChange: (value: string) => void;
}) {
  return (
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
          className={`${orderInputClassName} mt-3 w-full`}
          inputMode="numeric"
          value={form.pointAmount.toLocaleString("ko-KR")}
          onChange={(event) => onPointAmountChange(event.target.value)}
        />
      ) : null}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  isHighlight = false,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
}) {
  return (
    <div className="flex justify-between text-zinc-400">
      <span>{label}</span>
      <strong className={isHighlight ? "text-[#d6a84f]" : "text-white"}>{value}</strong>
    </div>
  );
}
