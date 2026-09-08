import { helperClassName, inputClassName } from "../styles/authForm.styles";
import type {
  EmailCheckState,
  SignupErrors,
  SignupFormState,
  SignupFormUpdateHandler,
} from "./signup.types";

type SignupEmailFieldProps = {
  email: SignupFormState["email"];
  errors: SignupErrors;
  emailCheckState: EmailCheckState;
  onChangeField: SignupFormUpdateHandler;
  onCheckEmail: () => void;
};

export function SignupEmailField({
  email,
  errors,
  emailCheckState,
  onChangeField,
  onCheckEmail,
}: SignupEmailFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#34465c]">
      이메일
      <div className="grid gap-2 sm:grid-cols-[1fr_112px]">
        <input
          aria-invalid={Boolean(errors.email || errors.emailCheck)}
          className={inputClassName}
          inputMode="email"
          placeholder="oilmaster@example.com"
          type="email"
          value={email}
          onChange={(event) => onChangeField("email", event.target.value)}
        />
        <button
          className="h-12 rounded-md border border-[#dce2e8] text-sm font-black text-[#071d3b] transition hover:border-[#ff4b1f] hover:text-[#ff4b1f] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={emailCheckState === "checking"}
          type="button"
          onClick={onCheckEmail}
        >
          {emailCheckState === "checking" ? "확인 중" : "중복확인"}
        </button>
      </div>
      {errors.email ? <span className={`${helperClassName} text-red-500`}>{errors.email}</span> : null}
      {errors.emailCheck ? (
        <span className={`${helperClassName} text-red-500`}>{errors.emailCheck}</span>
      ) : null}
      {emailCheckState === "available" ? (
        <span className={`${helperClassName} text-emerald-600`}>
          사용할 수 있는 이메일입니다.
        </span>
      ) : null}
    </label>
  );
}
