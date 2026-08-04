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
        <h2 className="text-2xl font-black text-white">로그인</h2>
        <p className="mt-2 text-sm text-zinc-400">이메일 계정 또는 카카오로 시작해 주세요.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-bold text-zinc-200">
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

        <label className="grid gap-2 text-sm font-bold text-zinc-200">
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

        <div className="flex items-center justify-between gap-3 text-sm text-zinc-400">
          <label className="flex items-center gap-2">
            <input
              checked={form.rememberEmail}
              className="h-4 w-4 accent-[#d6a84f]"
              type="checkbox"
              onChange={(event) => updateField("rememberEmail", event.target.checked)}
            />
            이메일 기억하기
          </label>
          <Link href="/find-email" className="text-[#d6a84f] hover:text-white">
            아이디 찾기
          </Link>
          <Link href="/find-password" className="text-[#d6a84f] hover:text-white">
            비밀번호 찾기
          </Link>
        </div>

        {error || loginMessage || signupMessage ? (
          <p className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm font-bold text-zinc-200">
            {error || loginMessage || signupMessage}
          </p>
        ) : null}

        <button
          className="h-12 w-full rounded-md bg-[#d6a84f] text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "처리 중..." : "로그인"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-zinc-500">
        <span className="h-px flex-1 bg-white/10" />
        <span>소셜 로그인</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid gap-3">
        <button className={`${socialButtonClassName} bg-[#03c75a] text-white`} disabled type="button">
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

      <p className="mt-6 text-center text-sm text-zinc-400">
        아직 회원이 아니신가요?{" "}
        <button
          className="font-bold text-[#d6a84f] hover:text-white"
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
