import { inquiryErrorClassName } from "./inquiry-form.types";

type InquiryPrivacyFieldProps = {
  isChecked: boolean;
  error?: string;
  onChange: (isChecked: boolean) => void;
};

export function InquiryPrivacyField({ isChecked, error, onChange }: InquiryPrivacyFieldProps) {
  return (
    <div className="rounded-md border border-[#dde2e8] bg-[#fbfcfd] p-4">
      <label className="flex items-start gap-3 text-sm leading-6 text-[#34465c]">
        <input
          className="mt-1 h-4 w-4 accent-[#ff4b1f]"
          type="checkbox"
          checked={isChecked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={Boolean(error)}
        />
        개인정보 수집 및 이용에 동의합니다. 문의 답변을 위해 이름, 이메일, 주문 정보를 확인할
        수 있습니다.
      </label>
      {error ? <p className={`mt-2 ${inquiryErrorClassName}`}>{error}</p> : null}
    </div>
  );
}
