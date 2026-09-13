"use client";

import Link from "next/link";
import React, { useState } from "react";
import { inputClassName } from "../styles/authForm.styles";
import { recoveryApi } from "./recovery.api";

const FindEmailForm = () => {
  const [phone, setPhone] = useState("");
  const [loginId, setLoginId] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginId("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const data = await recoveryApi.findEmail(phone.trim());
      setLoginId(data.loginId);
    } catch (nextError) {
      setMessage(nextError instanceof Error ? nextError.message : "아이디 찾기에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[520px] flex-col justify-center px-6 py-12">
      <div className="rounded-lg border border-white/10 bg-[#11100d] p-6 shadow-2xl shadow-black/30">
        <p className="mb-3 text-sm font-bold text-[#d6a84f]">FIND ACCOUNT</p>
        <h1 className="text-2xl font-black text-white">아이디 찾기</h1>
        <p className="mt-2 text-sm text-zinc-400">가입한 휴대폰 번호로 아이디를 찾습니다.</p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            휴대폰 번호
            <input
              className={inputClassName}
              inputMode="tel"
              placeholder="010-1234-5678"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>

          {loginId ? (
            <p className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-200">
              가입된 아이디: {loginId}
            </p>
          ) : null}
          {message ? (
            <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200">
              {message}
            </p>
          ) : null}

          <button
            className="h-12 w-full rounded-md bg-[#d6a84f] text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "확인 중..." : "아이디 찾기"}
          </button>
        </form>

        <div className="mt-6 flex justify-center gap-4 text-sm text-zinc-400">
          <Link href="/login" className="font-bold text-[#d6a84f] hover:text-white">
            로그인
          </Link>
          <Link href="/find-password" className="font-bold text-[#d6a84f] hover:text-white">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FindEmailForm;
