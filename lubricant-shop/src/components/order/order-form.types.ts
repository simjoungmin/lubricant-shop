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
  "h-11 rounded-md border border-[#dce2e8] bg-white px-3 text-sm font-bold text-[#071d3b] outline-none transition placeholder:text-[#a4adb8] focus:border-[#071d3b]";
