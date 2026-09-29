"use client";

import React, { useState } from "react";
import { signupApi, toSignupPayload } from "../signup/signup.api";
import { emailPattern, initialSignupForm, phonePattern } from "../signup/signup.constants";
import type {
  EmailCheckState,
  PhoneVerificationState,
  SignupErrors,
  SignupFormState,
} from "../signup/signup.types";
import { validateSignupForm } from "../signup/signup.validation";

type UseSignupFormOptions = {
  onSignupSuccess?: () => void;
};

export const useSignupForm = ({ onSignupSuccess }: UseSignupFormOptions = {}) => {
  const [signupForm, setSignupForm] = useState<SignupFormState>(initialSignupForm);
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});
  const [emailCheckState, setEmailCheckState] = useState<EmailCheckState>("idle");
  const [phoneVerificationState, setPhoneVerificationState] =
    useState<PhoneVerificationState>("idle");
  const [phoneVerificationToken, setPhoneVerificationToken] = useState("");
  const [phoneVerificationMessage, setPhoneVerificationMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [isPhoneVerificationSending, setIsPhoneVerificationSending] = useState(false);
  const [isPhoneVerificationConfirming, setIsPhoneVerificationConfirming] = useState(false);
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);

  const resetPhoneVerification = () => {
    setPhoneVerificationState("idle");
    setPhoneVerificationToken("");
    setPhoneVerificationMessage("");
    setSignupErrors((current) => ({
      ...current,
      phoneVerificationCode: undefined,
      submit: undefined,
    }));
  };

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

    if (field === "phone") {
      resetPhoneVerification();
      setSignupForm((current) => ({ ...current, phoneVerificationCode: "" }));
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

  const handleSendPhoneVerificationCode = async () => {
    const phone = signupForm.phone.trim();

    if (!phone) {
      setSignupErrors((current) => ({
        ...current,
        phone: "휴대폰 번호를 입력해 주세요.",
        phoneVerificationCode: undefined,
      }));
      return;
    }

    if (!phonePattern.test(phone)) {
      setSignupErrors((current) => ({
        ...current,
        phone: "휴대폰 번호 형식을 확인해 주세요.",
        phoneVerificationCode: undefined,
      }));
      return;
    }

    setIsPhoneVerificationSending(true);
    setPhoneVerificationMessage("");
    setSignupErrors((current) => ({
      ...current,
      phone: undefined,
      phoneVerificationCode: undefined,
      submit: undefined,
    }));

    try {
      const data = await signupApi.sendPhoneVerificationCode(phone);
      setPhoneVerificationState("sent");
      setPhoneVerificationToken("");
      setPhoneVerificationMessage(data.message);
    } catch (nextError) {
      setPhoneVerificationState("idle");
      setSignupErrors((current) => ({
        ...current,
        phoneVerificationCode:
          nextError instanceof Error ? nextError.message : "인증번호 발송에 실패했습니다.",
      }));
    } finally {
      setIsPhoneVerificationSending(false);
    }
  };

  const handleConfirmPhoneVerification = async () => {
    const phone = signupForm.phone.trim();
    const code = signupForm.phoneVerificationCode.trim();

    if (!phonePattern.test(phone)) {
      setSignupErrors((current) => ({
        ...current,
        phone: "휴대폰 번호 형식을 확인해 주세요.",
      }));
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setSignupErrors((current) => ({
        ...current,
        phoneVerificationCode: "인증번호 6자리를 입력해 주세요.",
      }));
      return;
    }

    setIsPhoneVerificationConfirming(true);
    setPhoneVerificationState("checking");
    setPhoneVerificationMessage("");
    setSignupErrors((current) => ({
      ...current,
      phoneVerificationCode: undefined,
      submit: undefined,
    }));

    try {
      const data = await signupApi.confirmPhoneVerification(phone, code);
      setPhoneVerificationState("verified");
      setPhoneVerificationToken(data.phoneVerificationToken);
      setPhoneVerificationMessage(data.message);
    } catch (nextError) {
      setPhoneVerificationState("sent");
      setPhoneVerificationToken("");
      setSignupErrors((current) => ({
        ...current,
        phoneVerificationCode:
          nextError instanceof Error ? nextError.message : "휴대폰 인증에 실패했습니다.",
      }));
    } finally {
      setIsPhoneVerificationConfirming(false);
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

    const nextErrors = validateSignupForm(signupForm, nextEmailCheckState, phoneVerificationState);
    setSignupErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSignupMessage("체크하지 않았거나 형식이 맞지 않는 항목을 확인해 주세요.");
      return;
    }

    setIsSignupSubmitting(true);
    setSignupMessage("");

    try {
      await signupApi.signup(toSignupPayload(signupForm, phoneVerificationToken));

      setSignupForm(initialSignupForm);
      setEmailCheckState("idle");
      setPhoneVerificationState("idle");
      setPhoneVerificationToken("");
      setPhoneVerificationMessage("");
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
    phoneVerificationState,
    phoneVerificationMessage,
    signupMessage,
    isPhoneVerificationSending,
    isPhoneVerificationConfirming,
    isSignupSubmitting,
    updateSignupField,
    handleEmailCheck,
    handleSendPhoneVerificationCode,
    handleConfirmPhoneVerification,
    handleSignupSubmit,
  };
};
