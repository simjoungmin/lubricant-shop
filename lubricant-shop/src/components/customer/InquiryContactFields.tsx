import type { AuthUser } from "@/components/auth/auth/auth.types";
import type {
  InquiryFormChangeHandler,
  InquiryFormErrors,
  InquiryFormValues,
} from "./inquiry-form.types";
import { InquiryTextInput } from "./InquiryTextInput";

type InquiryContactFieldsProps = {
  values: InquiryFormValues;
  errors: InquiryFormErrors;
  user: AuthUser;
  onChangeValue: InquiryFormChangeHandler;
};

export function InquiryContactFields({
  values,
  user,
  onChangeValue,
}: InquiryContactFieldsProps) {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <InquiryTextInput
          label="이름"
          value={user.name}
          disabled
          onChange={() => undefined}
        />
        <InquiryTextInput
          label="이메일"
          type="email"
          value={user.email}
          disabled
          onChange={() => undefined}
        />
      </div>

      <div className="grid gap-5">
        <InquiryTextInput
          label="주문번호"
          placeholder="주문 관련 문의라면 입력해 주세요"
          value={values.orderNumber}
          onChange={(value) => onChangeValue("orderNumber", value)}
        />
      </div>
    </>
  );
}
