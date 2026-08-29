import { helperClassName, inputClassName } from "../styles/authForm.styles";

type SignupTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  inputMode?: "email" | "tel";
  placeholder?: string;
  type?: "email" | "password" | "tel" | "text";
};

export function SignupTextField({
  label,
  value,
  onChange,
  error,
  inputMode,
  placeholder,
  type = "text",
}: SignupTextFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-zinc-200">
      {label}
      <input
        aria-invalid={Boolean(error)}
        className={inputClassName}
        inputMode={inputMode}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className={`${helperClassName} text-red-300`}>{error}</span> : null}
    </label>
  );
}
