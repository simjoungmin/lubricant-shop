import { helperClassName } from "../styles/authForm.styles";
import type { SignupErrors, SignupFormState, SignupFormUpdateHandler } from "./signup.types";

type SignupAgreementSectionProps = {
  form: SignupFormState;
  errors: SignupErrors;
  onChangeField: SignupFormUpdateHandler;
};

export function SignupAgreementSection({
  form,
  errors,
  onChangeField,
}: SignupAgreementSectionProps) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
      <p className="mb-3 text-sm font-black text-white">필수 동의</p>
      <div className="grid gap-3 text-sm text-zinc-300">
        <label className="flex items-start gap-3">
          <input
            checked={form.termsAgreed}
            className="mt-1 h-4 w-4 accent-[#d6a84f]"
            type="checkbox"
            onChange={(event) => onChangeField("termsAgreed", event.target.checked)}
          />
          이용약관에 동의합니다. 구매, 결제, 배송 서비스 제공을 위한 필수 약관입니다.
        </label>
        {errors.termsAgreed ? (
          <span className={`${helperClassName} text-red-300`}>{errors.termsAgreed}</span>
        ) : null}
        <label className="flex items-start gap-3">
          <input
            checked={form.privacyAgreed}
            className="mt-1 h-4 w-4 accent-[#d6a84f]"
            type="checkbox"
            onChange={(event) => onChangeField("privacyAgreed", event.target.checked)}
          />
          개인정보 수집 및 이용에 동의합니다. 회원 식별과 주문 관리를 위해 필요합니다.
        </label>
        {errors.privacyAgreed ? (
          <span className={`${helperClassName} text-red-300`}>{errors.privacyAgreed}</span>
        ) : null}
      </div>
    </div>
  );
}
