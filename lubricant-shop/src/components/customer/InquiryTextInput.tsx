import { inquiryErrorClassName, inquiryInputClassName } from "./inquiry-form.types";

type InquiryTextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type?: "text" | "email";
  disabled?: boolean;
};

export function InquiryTextInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  disabled = false,
}: InquiryTextInputProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#34465c]">
      {label}
      <input
        className={inquiryInputClassName}
        placeholder={placeholder}
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      />
      {error ? <span className={inquiryErrorClassName}>{error}</span> : null}
    </label>
  );
}
