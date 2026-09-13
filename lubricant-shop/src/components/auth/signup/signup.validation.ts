import { emailPattern, passwordPattern, phonePattern } from "./signup.constants";
import type { EmailCheckState, SignupErrors, SignupFormState } from "./signup.types";

export const validateSignupForm = (
  signupForm: SignupFormState,
  emailCheckState: EmailCheckState,
) => {
  const nextErrors: SignupErrors = {};
  const email = signupForm.email.trim();

  if (!email) {
    nextErrors.email = "이메일을 입력해 주세요.";
  } else if (!emailPattern.test(email)) {
    nextErrors.email = "올바른 이메일 형식으로 입력해 주세요.";
  }

  if (emailCheckState !== "available") {
    nextErrors.emailCheck =
      emailCheckState === "duplicated"
        ? "이미 사용 중인 이메일입니다."
        : "이메일 중복 확인을 완료해 주세요.";
  }

  if (!/^[a-z0-9]{4,16}$/.test(signupForm.loginId.trim())) {
    nextErrors.loginId = "아이디는 영문소문자/숫자 4~16자로 입력해 주세요.";
  }

  if (!passwordPattern.test(signupForm.password)) {
    nextErrors.password = "특수문자, 대문자, 소문자를 포함해 8자 이상 입력해 주세요.";
  }

  if (!signupForm.passwordConfirm) {
    nextErrors.passwordConfirm = "비밀번호를 한 번 더 입력해 주세요.";
  } else if (signupForm.passwordConfirm !== signupForm.password) {
    nextErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
  }

  if (!signupForm.name.trim()) {
    nextErrors.name = "이름을 입력해 주세요.";
  }

  if (!signupForm.address.trim()) {
    nextErrors.address = "주소를 입력해 주세요.";
  }

  if (!signupForm.phone.trim()) {
    nextErrors.phone = "휴대폰 번호를 입력해 주세요.";
  } else if (!phonePattern.test(signupForm.phone.trim())) {
    nextErrors.phone = "휴대폰 번호 형식을 확인해 주세요.";
  }

  if (!signupForm.termsAgreed) {
    nextErrors.termsAgreed = "이용약관 동의는 필수입니다.";
  }

  if (!signupForm.privacyAgreed) {
    nextErrors.privacyAgreed = "개인정보 수집 및 이용 동의는 필수입니다.";
  }

  return nextErrors;
};
