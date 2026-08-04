"use client";

import Link from "next/link";
import React, { useState } from "react";
import { inputClassName } from "../styles/authForm.styles";
import { recoveryApi, type PasswordVerificationMethod } from "./recovery.api";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FindPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<PasswordVerificationMethod>("EMAIL");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [devCode, setDevCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const trimmedEmail = email.trim();
  const canSendCode = emailPattern.test(trimmedEmail);

  const handleSendCode = async () => {
    setMessage("");
    setDevCode("");
    setIsSending(true);

    try {
      const data = await recoveryApi.sendPasswordVerificationCode(trimmedEmail, method);
      setMessage(data.message);
      setDevCode(data.devCode);
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
        email.trim(),
        code.trim(),
        newPassword,
        newPasswordConfirm,
      );
      setMessage(data.message);
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
          이메일로 계정을 확인한 뒤 이메일 또는 가입된 휴대폰 번호로 인증번호를 받습니다.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleResetPassword}>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            이메일
            <input
              aria-invalid={Boolean(trimmedEmail && !canSendCode)}
              className={inputClassName}
              inputMode="email"
              placeholder="oilmaster@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {trimmedEmail && !canSendCode ? (
              <span className="text-xs font-bold text-red-300">
                올바른 이메일 형식으로 입력해 주세요.
              </span>
            ) : null}
          </label>

          <div className="grid grid-cols-2 gap-2 rounded-md border border-white/10 bg-black/20 p-1">
            <button
              className={`h-10 rounded text-sm font-black transition ${
                method === "EMAIL" ? "bg-[#d6a84f] text-black" : "text-zinc-300 hover:text-white"
              }`}
              type="button"
              onClick={() => setMethod("EMAIL")}
            >
              이메일 인증
            </button>
            <button
              className={`h-10 rounded text-sm font-black transition ${
                method === "PHONE" ? "bg-[#d6a84f] text-black" : "text-zinc-300 hover:text-white"
              }`}
              type="button"
              onClick={() => setMethod("PHONE")}
            >
              전화번호 인증
            </button>
          </div>

          <button
            className="h-11 w-full rounded-md border border-white/10 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSending || !canSendCode}
            type="button"
            onClick={() => void handleSendCode()}
          >
            {isSending ? "발송 중..." : "인증번호 발송"}
          </button>

          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            인증번호
            <input
              className={inputClassName}
              inputMode="numeric"
              placeholder="6자리 인증번호"
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
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
          {devCode ? (
            <p className="rounded-md border border-[#d6a84f]/30 bg-[#d6a84f]/10 px-3 py-2 text-xs font-bold text-[#f0c76a]">
              개발용 인증번호: {devCode}
            </p>
          ) : null}

          <button
            className="h-12 w-full rounded-md bg-[#d6a84f] text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isResetting}
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
