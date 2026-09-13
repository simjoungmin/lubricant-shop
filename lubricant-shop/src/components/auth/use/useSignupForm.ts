"use client";

import React, { useState } from "react";
import { signupApi, toSignupPayload } from "../signup/signup.api";
import { emailPattern, initialSignupForm } from "../signup/signup.constants";
import type { EmailCheckState, SignupErrors, SignupFormState } from "../signup/signup.types";
import { validateSignupForm } from "../signup/signup.validation";

type UseSignupFormOptions = {
  onSignupSuccess?: () => void;
};

export const useSignupForm = ({ onSignupSuccess }: UseSignupFormOptions = {}) => {
  const [signupForm, setSignupForm] = useState<SignupFormState>(initialSignupForm);
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});
  const [emailCheckState, setEmailCheckState] = useState<EmailCheckState>("idle");
  const [signupMessage, setSignupMessage] = useState("");
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);

  const updateSignupField = <Field extends keyof SignupFormState>(
    field: Field,
    value: SignupFormState[Field],
  ) => {
    setSignupForm((current) => ({ ...current, [field]: value }));
    setSignupErrors((current) => ({ ...current, [field]: undefined, submit: undefined }));
    setSignupMessage("");

    if (field === "email") {
      setEmailCheckState("idle");
      setSignupErrors((current) => ({ ...current, emailCheck: undefined, submit: undefined }));
    }
  };

  const handleEmailCheck = async () => {
    const email = signupForm.email.trim().toLowerCase();

    if (!email) {
      setEmailCheckState("idle");
      setSignupErrors((current) => ({
        ...current,
        email: "이메일을 입력해 주세요.",
        emailCheck: undefined,
      }));
      return;
    }

    if (!emailPattern.test(email)) {
      setEmailCheckState("idle");
      setSignupErrors((current) => ({
        ...current,
        email: "올바른 이메일 형식으로 입력해 주세요.",
        emailCheck: undefined,
      }));
      return;
    }

    setEmailCheckState("checking");
    setSignupErrors((current) => ({ ...current, email: undefined, emailCheck: undefined }));

    try {
      const data = await signupApi.checkEmail(email);
      setEmailCheckState(data.duplicated ? "duplicated" : "available");
      setSignupErrors((current) => ({
        ...current,
        emailCheck: data.duplicated ? "이미 사용 중인 이메일입니다." : undefined,
      }));
    } catch (nextError) {
      setEmailCheckState("idle");
      setSignupErrors((current) => ({
        ...current,
        emailCheck:
          nextError instanceof Error ? nextError.message : "이메일 중복 확인에 실패했습니다.",
      }));
    }
  };

  const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = signupForm.email.trim().toLowerCase();
    let nextEmailCheckState = emailCheckState;

    if (emailPattern.test(email) && emailCheckState !== "available") {
      setEmailCheckState("checking");

      try {
        const data = await signupApi.checkEmail(email);
        nextEmailCheckState = data.duplicated ? "duplicated" : "available";
        setEmailCheckState(nextEmailCheckState);
      } catch (nextError) {
        setEmailCheckState("idle");
        setSignupErrors((current) => ({
          ...current,
          emailCheck:
            nextError instanceof Error ? nextError.message : "이메일 중복 확인에 실패했습니다.",
        }));
        setSignupMessage("체크하지 않았거나 형식이 맞지 않는 항목을 확인해 주세요.");
        return;
      }
    }

    const nextErrors = validateSignupForm(signupForm, nextEmailCheckState);
    setSignupErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSignupMessage("체크하지 않았거나 형식이 맞지 않는 항목을 확인해 주세요.");
      return;
    }

    setIsSignupSubmitting(true);
    setSignupMessage("");

    try {
      await signupApi.signup(toSignupPayload(signupForm));

      setSignupForm(initialSignupForm);
      setEmailCheckState("idle");
      setSignupErrors({});
      setSignupMessage("회원가입이 완료되었습니다. 로그인해 주세요.");
      onSignupSuccess?.();
    } catch (nextError) {
      setSignupErrors((current) => ({
        ...current,
        submit: nextError instanceof Error ? nextError.message : "회원가입에 실패했습니다.",
      }));
    } finally {
      setIsSignupSubmitting(false);
    }
  };

  return {
    signupForm,
    signupErrors,
    emailCheckState,
    signupMessage,
    isSignupSubmitting,
    updateSignupField,
    handleEmailCheck,
    handleSignupSubmit,
  };
};
