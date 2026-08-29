import type { SignupErrors, SignupFormState, SignupFormUpdateHandler } from "./signup.types";
import { SignupTextField } from "./SignupTextField";

type SignupProfileFieldsProps = {
  form: SignupFormState;
  errors: SignupErrors;
  onChangeField: SignupFormUpdateHandler;
};

export function SignupProfileFields({ form, errors, onChangeField }: SignupProfileFieldsProps) {
  return (
    <>
      <SignupTextField
        label="이름"
        placeholder="이름 입력"
        value={form.name}
        error={errors.name}
        onChange={(value) => onChangeField("name", value)}
      />
      <SignupTextField
        label="휴대폰 번호"
        inputMode="tel"
        placeholder="010-1234-5678"
        type="tel"
        value={form.phone}
        error={errors.phone}
        onChange={(value) => onChangeField("phone", value)}
      />
    </>
  );
}
