export type InquiryFormValues = {
  name: string;
  email: string;
  orderNumber: string;
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
  title: "",
  content: "",
  privacyAgreed: false,
};

export const inquiryInputClassName =
  "h-12 rounded-md border border-[#dce2e8] bg-white px-4 text-sm font-semibold text-[#071d3b] outline-none transition placeholder:text-[#a4adb8] focus:border-[#ff4b1f]";

export const inquiryErrorClassName = "text-xs font-bold text-red-500";
