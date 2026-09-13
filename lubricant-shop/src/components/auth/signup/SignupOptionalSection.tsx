import { inputClassName } from "../styles/authForm.styles";
import type { SignupFormState, SignupFormUpdateHandler } from "./signup.types";

type SignupOptionalSectionProps = {
  form: SignupFormState;
  onChangeField: SignupFormUpdateHandler;
};

export function SignupOptionalSection({ form, onChangeField }: SignupOptionalSectionProps) {
  return (
    <div className="rounded-md border border-[#dce2e8] bg-[#f8fafc] p-4">
      <p className="mb-3 text-sm font-black text-[#071d3b]">선택 항목</p>
      <div className="grid gap-3 text-sm text-[#34465c]">
        <label className="flex items-start gap-3">
          <input
            checked={form.vehicleEnabled}
            className="mt-1 h-4 w-4 accent-[#ff4b1f]"
            type="checkbox"
            onChange={(event) => onChangeField("vehicleEnabled", event.target.checked)}
          />
          내 차량 등록
        </label>
        {form.vehicleEnabled ? (
          <input
            className={inputClassName}
            placeholder="예: 2022 그랜저 2.5 가솔린"
            type="text"
            value={form.vehicleInfo}
            onChange={(event) => onChangeField("vehicleInfo", event.target.value)}
          />
        ) : null}
        <label className="flex items-start gap-3">
          <input
            checked={form.marketingAgreed}
            className="mt-1 h-4 w-4 accent-[#ff4b1f]"
            type="checkbox"
            onChange={(event) => onChangeField("marketingAgreed", event.target.checked)}
          />
          마케팅 정보 수신에 동의합니다.
        </label>
      </div>
    </div>
  );
}
