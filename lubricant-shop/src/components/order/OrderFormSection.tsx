import type { CartItem } from "@/components/cart/CartContext";
import { OrderItemsSection } from "@/components/order/OrderItemsSection";
import { OrderPaymentSummary } from "@/components/order/OrderPaymentSummary";
import { PaymentMethodFields } from "@/components/order/PaymentMethodFields";
import { ShippingAddressSection } from "@/components/order/ShippingAddressSection";
import {
  type OrderFieldChangeHandler,
  type OrderFormState,
} from "@/components/order/order-form.types";
import type { FormEvent } from "react";

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
        <ShippingAddressSection form={form} onUpdateForm={onUpdateForm} />
        <PaymentMethodFields
          form={form}
          previewPaymentAmount={previewPaymentAmount}
          onUpdateForm={onUpdateForm}
        />
        <OrderItemsSection items={items} />
      </section>

      <OrderPaymentSummary
        form={form}
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        expectedRewardPoint={expectedRewardPoint}
        pointBalance={pointBalance}
        usablePointAmount={usablePointAmount}
        previewPaymentAmount={previewPaymentAmount}
        message={message}
        isCreatePending={isCreatePending}
        itemCount={items.length}
        onUpdateForm={onUpdateForm}
        onPointAmountChange={onPointAmountChange}
      />
    </form>
  );
}
