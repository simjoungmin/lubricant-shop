import {
  type OrderFieldChangeHandler,
  type OrderFormState,
  orderInputClassName,
} from "@/components/order/order-form.types";

type ShippingAddressSectionProps = {
  form: OrderFormState;
  onUpdateForm: OrderFieldChangeHandler;
};

export function ShippingAddressSection({
  form,
  onUpdateForm,
}: ShippingAddressSectionProps) {
  return (
    <div className="rounded-lg border border-[#dde2e8] bg-white p-5">
      <h2 className="text-lg font-black text-[#071d3b]">배송지 입력</h2>
      <div className="mt-5 grid gap-4">
        <OrderInput
          label="수령인"
          value={form.receiverName}
          onChange={(value) => onUpdateForm("receiverName", value)}
        />
        <OrderInput
          label="연락처"
          inputMode="tel"
          placeholder="010-0000-0000"
          value={form.receiverPhone}
          onChange={(value) => onUpdateForm("receiverPhone", value)}
        />
        <OrderInput
          label="배송지"
          placeholder="주소를 입력해 주세요"
          value={form.shippingAddress}
          onChange={(value) => onUpdateForm("shippingAddress", value)}
        />
        <OrderInput
          label="배송 요청사항"
          placeholder="문 앞에 놓아주세요"
          value={form.deliveryRequest}
          onChange={(value) => onUpdateForm("deliveryRequest", value)}
        />
      </div>
    </div>
  );
}

function OrderInput({
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
    <label className="grid gap-2 text-sm font-bold text-[#34465c]">
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
