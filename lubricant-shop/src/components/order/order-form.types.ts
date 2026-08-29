import type { PaymentMethod } from "@/components/admin/admin.api";

export type OrderFormState = {
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  deliveryRequest: string;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardOwnerName: string;
  depositName: string;
  virtualAccountApplicant: string;
  usePoints: boolean;
  pointAmount: number;
};

export type OrderFieldChangeHandler = <Field extends keyof OrderFormState>(
  field: Field,
  value: OrderFormState[Field],
) => void;

export const initialOrderFormState: OrderFormState = {
  receiverName: "",
  receiverPhone: "",
  shippingAddress: "",
  deliveryRequest: "",
  paymentMethod: "CARD",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  cardOwnerName: "",
  depositName: "",
  virtualAccountApplicant: "",
  usePoints: false,
  pointAmount: 0,
};

export const orderInputClassName =
  "h-11 rounded-md border border-white/10 bg-[#11100d] px-3 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d6a84f]";
