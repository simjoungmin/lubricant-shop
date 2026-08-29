export type InquiryFormValues = {
  name: string;
  email: string;
  orderNumber: string;
  vehicleInfo: string;
  title: string;
  content: string;
  privacyAgreed: boolean;
};

export type InquiryFormErrors = Partial<Record<keyof InquiryFormValues | "attachments", string>>;

export type InquiryFormChangeHandler = <Key extends keyof InquiryFormValues>(
  key: Key,
  value: InquiryFormValues[Key],
) => void;

export const initialInquiryFormValues: InquiryFormValues = {
  name: "",
  email: "",
  orderNumber: "",
  vehicleInfo: "",
  title: "",
  content: "",
  privacyAgreed: false,
};

export const inquiryInputClassName =
  "h-12 rounded-md border border-white/10 bg-[#11100d] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d6a84f]";

export const inquiryErrorClassName = "text-xs font-bold text-red-300";
