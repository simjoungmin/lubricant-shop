import type { SignupErrors, SignupFormState, SignupFormUpdateHandler } from "./signup.types";
import { SignupTextField } from "./SignupTextField";

type SignupPasswordFieldsProps = {
  form: SignupFormState;
  errors: SignupErrors;
  onChangeField: SignupFormUpdateHandler;
};

export function SignupPasswordFields({
  form,
  errors,
  onChangeField,
}: SignupPasswordFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SignupTextField
        label="비밀번호"
        placeholder="Aa! 포함 8자 이상"
        type="password"
        value={form.password}
        error={errors.password}
        onChange={(value) => onChangeField("password", value)}
      />
      <SignupTextField
        label="비밀번호 확인"
        placeholder="비밀번호 재입력"
        type="password"
        value={form.passwordConfirm}
        error={errors.passwordConfirm}
        onChange={(value) => onChangeField("passwordConfirm", value)}
      />
    </div>
  );
}
