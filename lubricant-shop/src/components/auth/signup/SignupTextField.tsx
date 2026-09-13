import {
  helperClassName,
  inputClassName,
} from "../styles/authForm.styles";

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
    <label className="grid min-w-0 gap-2 text-sm font-bold text-[#34465c]">
      {label}

      <input
        aria-invalid={Boolean(error)}
        className={`${inputClassName} w-full min-w-0 max-w-full box-border`}
        inputMode={inputMode}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      {error ? (
        <span
          className={`${helperClassName} break-words text-red-500`}
          role="alert"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}