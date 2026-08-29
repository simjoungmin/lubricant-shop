import { inputClassName } from "../styles/authForm.styles";
import type { SignupFormState, SignupFormUpdateHandler } from "./signup.types";

type SignupOptionalSectionProps = {
  form: SignupFormState;
  onChangeField: SignupFormUpdateHandler;
};

export function SignupOptionalSection({ form, onChangeField }: SignupOptionalSectionProps) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
      <p className="mb-3 text-sm font-black text-white">선택 항목</p>
      <div className="grid gap-3 text-sm text-zinc-300">
        <label className="flex items-start gap-3">
          <input
            checked={form.vehicleEnabled}
            className="mt-1 h-4 w-4 accent-[#d6a84f]"
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
            className="mt-1 h-4 w-4 accent-[#d6a84f]"
            type="checkbox"
            onChange={(event) => onChangeField("marketingAgreed", event.target.checked)}
          />
          마케팅 정보 수신에 동의합니다.
        </label>
      </div>
    </div>
  );
}
