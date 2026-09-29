"use client";

import Link from "next/link";
import React, { useState } from "react";
import { inputClassName } from "../styles/authForm.styles";
import { recoveryApi } from "./recovery.api";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^01[0-9]{8,9}$/;

const FindPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const trimmedEmail = email.trim();
  const normalizedPhone = phone.replace(/[^0-9]/g, "");
  const isEmailValid = emailPattern.test(trimmedEmail);
  const isPhoneValid = phonePattern.test(normalizedPhone);
  const canSendCode = isEmailValid && isPhoneValid;

  const handleSendCode = async () => {
    setMessage("");
    setIsSending(true);

    try {
      const data = await recoveryApi.sendPasswordVerificationCode(trimmedEmail, normalizedPhone);
      setMessage(data.message);
    } catch (nextError) {
      setMessage(nextError instanceof Error ? nextError.message : "인증번호 발송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (newPassword !== newPasswordConfirm) {
      setMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsResetting(true);

    try {
      const data = await recoveryApi.resetPassword(
        trimmedEmail,
        code.trim(),
        newPassword,
        newPasswordConfirm,
      );
      setMessage(data.message);
      setPhone("");
      setCode("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (nextError) {
      setMessage(nextError instanceof Error ? nextError.message : "비밀번호 변경에 실패했습니다.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[560px] flex-col justify-center px-6 py-12">
      <div className="rounded-lg border border-white/10 bg-[#11100d] p-6 shadow-2xl shadow-black/30">
        <p className="mb-3 text-sm font-bold text-[#d6a84f]">RESET PASSWORD</p>
        <h1 className="text-2xl font-black text-white">비밀번호 찾기</h1>
        <p className="mt-2 text-sm text-zinc-400">
          가입 이메일과 휴대폰 번호가 일치하면 문자로 인증번호를 발송합니다.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleResetPassword}>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            이메일
            <input
              aria-invalid={Boolean(trimmedEmail && !isEmailValid)}
              className={inputClassName}
              inputMode="email"
              placeholder="oilmaster@example.com"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setMessage("");
              }}
            />
            {trimmedEmail && !isEmailValid ? (
              <span className="text-xs font-bold text-red-300">
                올바른 이메일 형식으로 입력해 주세요.
              </span>
            ) : null}
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            휴대폰 번호
            <input
              aria-invalid={Boolean(phone && !isPhoneValid)}
              className={inputClassName}
              inputMode="tel"
              placeholder="01012345678"
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setMessage("");
              }}
            />
            {phone && !isPhoneValid ? (
              <span className="text-xs font-bold text-red-300">
                가입한 휴대폰 번호를 숫자만 입력해 주세요.
              </span>
            ) : null}
          </label>

          <button
            className="h-11 w-full rounded-md border border-white/10 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSending || !canSendCode}
            type="button"
            onClick={() => void handleSendCode()}
          >
            {isSending ? "문자 발송 중..." : "인증번호 문자 발송"}
          </button>

          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            인증번호
            <input
              className={inputClassName}
              inputMode="numeric"
              placeholder="6자리 인증번호"
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            새 비밀번호
            <input
              className={inputClassName}
              placeholder="Aa! 포함 8자 이상"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            새 비밀번호 확인
            <input
              aria-invalid={Boolean(newPasswordConfirm && newPassword !== newPasswordConfirm)}
              className={inputClassName}
              placeholder="새 비밀번호 재입력"
              type="password"
              value={newPasswordConfirm}
              onChange={(event) => setNewPasswordConfirm(event.target.value)}
            />
            {newPasswordConfirm && newPassword !== newPasswordConfirm ? (
              <span className="text-xs font-bold text-red-300">
                새 비밀번호가 일치하지 않습니다.
              </span>
            ) : null}
          </label>

          {message ? (
            <p className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm font-bold text-zinc-200">
              {message}
            </p>
          ) : null}

          <button
            className="h-12 w-full rounded-md bg-[#d6a84f] text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isResetting || code.trim().length !== 6}
            type="submit"
          >
            {isResetting ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>

        <div className="mt-6 flex justify-center gap-4 text-sm text-zinc-400">
          <Link href="/login" className="font-bold text-[#d6a84f] hover:text-white">
            로그인
          </Link>
          <Link href="/find-email" className="font-bold text-[#d6a84f] hover:text-white">
            아이디 찾기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FindPasswordForm;
