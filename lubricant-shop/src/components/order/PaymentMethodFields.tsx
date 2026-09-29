import type { PaymentMethod } from "@/components/admin/admin.api";
import { formatPrice } from "@/components/cart/cart.utils";
import {
  type OrderFieldChangeHandler,
  type OrderFormState,
  orderInputClassName,
} from "@/components/order/order-form.types";

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  CARD: "카드",
  BANK_TRANSFER: "무통장입금",
  VIRTUAL_ACCOUNT: "가상계좌",
  CASH: "현금",
};

type PaymentMethodFieldsProps = {
  form: OrderFormState;
  previewPaymentAmount: number;
  onUpdateForm: OrderFieldChangeHandler;
};

export function PaymentMethodFields({
  form,
  previewPaymentAmount,
  onUpdateForm,
}: PaymentMethodFieldsProps) {
  if (form.paymentMethod === "CARD") {
    return (
      <PaymentBox title="토스페이먼츠 카드 결제">
        <p className="text-xs font-bold leading-5 text-[#65717f]">
          주문을 저장하면 토스페이먼츠 결제창으로 이동합니다. 카드 정보는 OIL MASTER에 저장되지 않습니다.
        </p>
      </PaymentBox>
    );
  }

  if (form.paymentMethod === "BANK_TRANSFER") {
    return (
      <div className="rounded-md border border-[#ffd3c5] bg-[#fff3ef] p-4">
        <p className="text-sm font-black text-[#ff4b1f]">무통장입금 안내</p>
        <div className="mt-3 grid gap-2 text-sm font-bold text-[#34465c]">
          <TransferRow label="입금 계좌" value="국민은행 123456-01-123456" />
          <TransferRow label="예금주" value="오일마스터" />
          <TransferRow label="입금 금액" value={formatPrice(previewPaymentAmount)} isHighlight />
        </div>
        <PaymentInput
          label="입금자명"
          placeholder="실제 입금자명을 입력해 주세요"
          value={form.depositName}
          onChange={(value) => onUpdateForm("depositName", value)}
        />
        <p className="mt-3 text-xs font-bold leading-5 text-[#65717f]">
          관리자가 입금 내역을 확인하면 결제 완료로 변경됩니다.
        </p>
      </div>
    );
  }

  if (form.paymentMethod === "VIRTUAL_ACCOUNT") {
    return (
      <PaymentBox title="가상계좌">
        <p className="text-xs font-bold leading-5 text-[#65717f]">
          가상계좌 자동 발급은 준비 중입니다. 현재는 신청자명만 입력할 수 있습니다.
        </p>
        <PaymentInput
          label="신청자명"
          placeholder="홍길동"
          value={form.virtualAccountApplicant}
          onChange={(value) => onUpdateForm("virtualAccountApplicant", value)}
        />
      </PaymentBox>
    );
  }

  return (
    <PaymentBox title="현금 결제 안내">
      <p className="text-xs font-bold leading-5 text-[#65717f]">
        현금 결제는 관리자가 확인한 뒤 결제 완료로 변경됩니다.
      </p>
    </PaymentBox>
  );
}

function PaymentBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-[#dde2e8] bg-[#fbfcfd] p-4">
      <p className="text-sm font-black text-[#071d3b]">{title}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function PaymentInput({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "tel" | "decimal";
}) {
  return (
    <label className="mt-4 grid gap-2 text-xs font-black text-[#65717f]">
      {label}
      <input
        className={orderInputClassName}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TransferRow({
  label,
  value,
  isHighlight = false,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[#65717f]">{label}</span>
      <strong className={isHighlight ? "text-[#ff4b1f]" : "text-[#071d3b]"}>{value}</strong>
    </div>
  );
}
