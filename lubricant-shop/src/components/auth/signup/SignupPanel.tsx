"use client";

import React from "react";
import { helperClassName, inputClassName } from "../styles/authForm.styles";
import { useSignupForm } from "../use/useSignupForm";

type SignupPanelProps = {
  onLoginClick: () => void;
  onSignupSuccess: () => void;
};

const SignupPanel = ({ onLoginClick, onSignupSuccess }: SignupPanelProps) => {
  const {
    signupForm,
    signupErrors,
    emailCheckState,
    signupMessage,
    isSignupSubmitting,
    updateSignupField,
    handleEmailCheck,
    handleSignupSubmit,
  } = useSignupForm({ onSignupSuccess });

  return (
    <>
      <div className="mb-7">
        <h2 className="text-2xl font-black text-white">회원가입</h2>
        <p className="mt-2 text-sm text-zinc-400">
          필수 정보를 입력하고 약관 동의를 완료해 주세요.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSignupSubmit} noValidate>
        <label className="grid gap-2 text-sm font-bold text-zinc-200">
          이메일
          <div className="grid gap-2 sm:grid-cols-[1fr_112px]">
            <input
              aria-invalid={Boolean(signupErrors.email || signupErrors.emailCheck)}
              className={inputClassName}
              inputMode="email"
              placeholder="oilmaster@example.com"
              type="email"
              value={signupForm.email}
              onChange={(event) => updateSignupField("email", event.target.value)}
            />
            <button
              className="h-12 rounded-md border border-white/10 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={emailCheckState === "checking"}
              type="button"
              onClick={() => void handleEmailCheck()}
            >
              {emailCheckState === "checking" ? "확인 중" : "중복확인"}
            </button>
          </div>
          {signupErrors.email ? (
            <span className={`${helperClassName} text-red-300`}>{signupErrors.email}</span>
          ) : null}
          {signupErrors.emailCheck ? (
            <span className={`${helperClassName} text-red-300`}>{signupErrors.emailCheck}</span>
          ) : null}
          {emailCheckState === "available" ? (
            <span className={`${helperClassName} text-emerald-300`}>
              사용 가능한 이메일입니다.
            </span>
          ) : null}
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            비밀번호
            <input
              aria-invalid={Boolean(signupErrors.password)}
              className={inputClassName}
              placeholder="Aa! 포함 8자 이상"
              type="password"
              value={signupForm.password}
              onChange={(event) => updateSignupField("password", event.target.value)}
            />
            {signupErrors.password ? (
              <span className={`${helperClassName} text-red-300`}>{signupErrors.password}</span>
            ) : null}
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            비밀번호 확인
            <input
              aria-invalid={Boolean(signupErrors.passwordConfirm)}
              className={inputClassName}
              placeholder="비밀번호 재입력"
              type="password"
              value={signupForm.passwordConfirm}
              onChange={(event) => updateSignupField("passwordConfirm", event.target.value)}
            />
            {signupErrors.passwordConfirm ? (
              <span className={`${helperClassName} text-red-300`}>
                {signupErrors.passwordConfirm}
              </span>
            ) : null}
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-zinc-200">
          이름
          <input
            aria-invalid={Boolean(signupErrors.name)}
            className={inputClassName}
            placeholder="이름 입력"
            type="text"
            value={signupForm.name}
            onChange={(event) => updateSignupField("name", event.target.value)}
          />
          {signupErrors.name ? (
            <span className={`${helperClassName} text-red-300`}>{signupErrors.name}</span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm font-bold text-zinc-200">
          휴대폰 번호
          <input
            aria-invalid={Boolean(signupErrors.phone)}
            className={inputClassName}
            inputMode="tel"
            placeholder="010-1234-5678"
            type="tel"
            value={signupForm.phone}
            onChange={(event) => updateSignupField("phone", event.target.value)}
          />
          {signupErrors.phone ? (
            <span className={`${helperClassName} text-red-300`}>{signupErrors.phone}</span>
          ) : null}
        </label>

        <div className="rounded-md border border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-sm font-black text-white">필수 동의</p>
          <div className="grid gap-3 text-sm text-zinc-300">
            <label className="flex items-start gap-3">
              <input
                checked={signupForm.termsAgreed}
                className="mt-1 h-4 w-4 accent-[#d6a84f]"
                type="checkbox"
                onChange={(event) => updateSignupField("termsAgreed", event.target.checked)}
              />
              이용약관에 동의합니다. 구매, 결제, 배송 서비스 제공을 위한 필수 약관입니다.
            </label>
            {signupErrors.termsAgreed ? (
              <span className={`${helperClassName} text-red-300`}>
                {signupErrors.termsAgreed}
              </span>
            ) : null}
            <label className="flex items-start gap-3">
              <input
                checked={signupForm.privacyAgreed}
                className="mt-1 h-4 w-4 accent-[#d6a84f]"
                type="checkbox"
                onChange={(event) => updateSignupField("privacyAgreed", event.target.checked)}
              />
              개인정보 수집 및 이용에 동의합니다. 회원 식별과 주문 관리를 위해 필요합니다.
            </label>
            {signupErrors.privacyAgreed ? (
              <span className={`${helperClassName} text-red-300`}>
                {signupErrors.privacyAgreed}
              </span>
            ) : null}
          </div>
        </div>

        <div className="rounded-md border border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-sm font-black text-white">선택 항목</p>
          <div className="grid gap-3 text-sm text-zinc-300">
            <label className="flex items-start gap-3">
              <input
                checked={signupForm.vehicleEnabled}
                className="mt-1 h-4 w-4 accent-[#d6a84f]"
                type="checkbox"
                onChange={(event) => updateSignupField("vehicleEnabled", event.target.checked)}
              />
              내 차량 등록
            </label>
            {signupForm.vehicleEnabled ? (
              <input
                className={inputClassName}
                placeholder="예: 2022 그랜저 2.5 가솔린"
                type="text"
                value={signupForm.vehicleInfo}
                onChange={(event) => updateSignupField("vehicleInfo", event.target.value)}
              />
            ) : null}
            <label className="flex items-start gap-3">
              <input
                checked={signupForm.marketingAgreed}
                className="mt-1 h-4 w-4 accent-[#d6a84f]"
                type="checkbox"
                onChange={(event) => updateSignupField("marketingAgreed", event.target.checked)}
              />
              마케팅 정보 수신에 동의합니다.
            </label>
          </div>
        </div>

        {signupMessage || signupErrors.submit ? (
          <p
            className={`rounded-md border px-3 py-2 text-sm font-bold ${
              signupErrors.submit
                ? "border-red-400/30 bg-red-500/10 text-red-200"
                : "border-white/10 bg-black/20 text-zinc-200"
            }`}
          >
            {signupErrors.submit || signupMessage}
          </p>
        ) : null}

        <button
          className="h-12 w-full rounded-md bg-[#d6a84f] text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSignupSubmitting}
          type="submit"
        >
          {isSignupSubmitting ? "가입 처리 중..." : "회원가입 완료"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-400">
        이미 계정이 있으신가요?{" "}
        <button
          className="font-bold text-[#d6a84f] hover:text-white"
          type="button"
          onClick={onLoginClick}
        >
          로그인
        </button>
      </p>
    </>
  );
};

export default SignupPanel;
