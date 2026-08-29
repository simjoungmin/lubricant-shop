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
  errors,
  user,
  onChangeValue,
}: InquiryContactFieldsProps) {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <InquiryTextInput
          label="이름"
          placeholder="이름을 입력해 주세요"
          value={values.name || user.name}
          error={errors.name}
          onChange={(value) => onChangeValue("name", value)}
        />
        <InquiryTextInput
          label="이메일"
          type="email"
          placeholder="reply@example.com"
          value={values.email || user.email}
          error={errors.email}
          onChange={(value) => onChangeValue("email", value)}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <InquiryTextInput
          label="주문번호"
          placeholder="주문 관련 문의라면 입력해 주세요"
          value={values.orderNumber}
          onChange={(value) => onChangeValue("orderNumber", value)}
        />
        <InquiryTextInput
          label="차량 정보"
          placeholder="예: 2022 그랜저 2.5 가솔린"
          value={values.vehicleInfo}
          onChange={(value) => onChangeValue("vehicleInfo", value)}
        />
      </div>
    </>
  );
}
