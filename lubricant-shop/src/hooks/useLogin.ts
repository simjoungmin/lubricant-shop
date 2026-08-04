"use client";

import { useAuth, type AuthProviderName, type AuthUser } from "@/components/auth/auth/AuthContext";
import { useState } from "react";

type LoginFormState = {
  email: string;
  password: string;
  rememberEmail: boolean;
};

type SocialProvider = Exclude<AuthProviderName, "email">;

type UseLoginOptions = {
  onLoginSuccess?: (user: AuthUser) => void;
  onLoginFailure?: (message: string) => void;
};

const initialFormState: LoginFormState = {
  email: "",
  password: "",
  rememberEmail: true,
};

const REMEMBERED_EMAIL_STORAGE_KEY = "oil-master:remembered-email";

const getInitialFormState = (): LoginFormState => {
  if (typeof window === "undefined") {
    return initialFormState;
  }

  const rememberedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_STORAGE_KEY);

  if (!rememberedEmail) {
    return initialFormState;
  }

  return {
    ...initialFormState,
    email: rememberedEmail,
    rememberEmail: true,
  };
};

export function useLogin(options: UseLoginOptions = {}) {
  const { login, socialLogin } = useAuth();
  const [form, setForm] = useState<LoginFormState>(getInitialFormState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <Field extends keyof LoginFormState>(
    field: Field,
    value: LoginFormState[Field],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const submitLogin = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login({ email: form.email.trim(), password: form.password });

      if (form.rememberEmail) {
        window.localStorage.setItem(REMEMBERED_EMAIL_STORAGE_KEY, form.email.trim());
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_STORAGE_KEY);
      }

      options.onLoginSuccess?.(user);
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "로그인에 실패했습니다.";
      setError(message);
      options.onLoginFailure?.(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitSocialLogin = async (provider: SocialProvider) => {
    setError("");
    setIsSubmitting(true);

    try {
      await socialLogin(provider);
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "소셜 로그인에 실패했습니다.";
      setError(message);
      options.onLoginFailure?.(message);
      setIsSubmitting(false);
    }
  };

  return {
    form,
    error,
    isSubmitting,
    updateField,
    submitLogin,
    submitSocialLogin,
  };
}