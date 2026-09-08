"use client";

import { useLogin } from "@/hooks/useLogin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { inputClassName, socialButtonClassName } from "../styles/authForm.styles";

type LoginPanelProps = {
  signupMessage: string;
  onSignupClick: () => void;
};

const LoginPanel = ({ signupMessage, onSignupClick }: LoginPanelProps) => {
  const router = useRouter();
  const [loginMessage, setLoginMessage] = useState("");
  const { form, error, isSubmitting, updateField, submitLogin, submitSocialLogin } = useLogin({
    onLoginSuccess: () => {
      setLoginMessage("");
      const redirectPath =
        typeof window === "undefined"
          ? "/"
          : new URLSearchParams(window.location.search).get("redirect") ?? "/";
      router.push(redirectPath);
    },
    onLoginFailure: (message) => {
      setLoginMessage(message);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginMessage("");
    void submitLogin();
  };

  return (
    <>
      <div className="mb-7">
        <h2 className="text-2xl font-black text-[#071d3b]">로그인</h2>
        <p className="mt-2 text-sm text-[#65717f]">
          이메일 계정 또는 소셜 계정으로 시작해 주세요.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-bold text-[#34465c]">
          이메일
          <input
            className={inputClassName}
            inputMode="email"
            name="email"
            placeholder="oilmaster@example.com"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-[#34465c]">
          비밀번호
          <input
            className={inputClassName}
            name="password"
            placeholder="비밀번호 입력"
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#65717f]">
          <label className="flex items-center gap-2">
            <input
              checked={form.rememberEmail}
              className="h-4 w-4 accent-[#ff4b1f]"
              type="checkbox"
              onChange={(event) => updateField("rememberEmail", event.target.checked)}
            />
            이메일 기억하기
          </label>
          <Link href="/find-email" className="font-bold text-[#ff4b1f] hover:text-[#071d3b]">
            아이디 찾기
          </Link>
          <Link href="/find-password" className="font-bold text-[#ff4b1f] hover:text-[#071d3b]">
            비밀번호 찾기
          </Link>
        </div>

        {error || loginMessage || signupMessage ? (
          <p className="rounded-md border border-[#ffd3c5] bg-[#fff3ef] px-3 py-2 text-sm font-bold text-[#071d3b]">
            {error || loginMessage || signupMessage}
          </p>
        ) : null}

        <button
          className="h-12 w-full rounded-md bg-[#ff4b1f] text-sm font-black text-white transition hover:bg-[#e63e16] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "처리 중..." : "로그인"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-[#8a94a1]">
        <span className="h-px flex-1 bg-[#e2e6eb]" />
        <span>소셜 로그인</span>
        <span className="h-px flex-1 bg-[#e2e6eb]" />
      </div>

      <div className="grid gap-3">
        <button
          className={`${socialButtonClassName} bg-[#03c75a] text-white hover:bg-[#02b351]`}
          disabled={isSubmitting}
          type="button"
          onClick={() => void submitSocialLogin("naver")}
        >
          네이버 로그인
        </button>
        <button
          className={`${socialButtonClassName} bg-[#fee500] text-black hover:bg-[#ffed33]`}
          disabled={isSubmitting}
          type="button"
          onClick={() => void submitSocialLogin("kakao")}
        >
          카카오 로그인
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-[#65717f]">
        아직 회원이 아니신가요?{" "}
        <button
          className="font-bold text-[#ff4b1f] hover:text-[#071d3b]"
          type="button"
          onClick={onSignupClick}
        >
          회원가입
        </button>
      </p>
    </>
  );
};

export default LoginPanel;
