"use client";

import React, { useState } from "react";
import SignupPanel from "../signup/SignupPanel";
import LoginPanel from "./LoginPanel";
import type { AuthMode } from "./login-form.types";

const LoginForm = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [signupMessage, setSignupMessage] = useState("");

  const isLoginMode = mode === "login";

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);

    if (nextMode === "signup") {
      setSignupMessage("");
    }
  };

  const handleSignupSuccess = () => {
    setSignupMessage("회원가입이 완료되었습니다. 로그인해 주세요.");
    setMode("login");
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-[1180px] items-center gap-12 px-6 py-14 lg:grid-cols-[1fr_460px] lg:px-8">
      <div className="max-w-xl">
        <p className="mb-4 text-sm font-bold text-[#d6a84f]">OIL MASTER ACCOUNT</p>
        <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
          필요한 오일을 빠르게 찾고 주문하세요
        </h1>
        <p className="mt-5 text-base leading-7 text-zinc-300">
          로그인하면 장바구니, 주문 내역, 관심 상품을 계정과 연결할 수 있습니다.
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#11100d] p-6 shadow-2xl shadow-black/30">
        <div className="mb-7">
          <div className="grid grid-cols-2 rounded-md border border-white/10 bg-black/20 p-1">
            <button
              className={`h-10 rounded text-sm font-black transition ${
                isLoginMode ? "bg-[#d6a84f] text-black" : "text-zinc-300 hover:text-white"
              }`}
              type="button"
              onClick={() => handleModeChange("login")}
            >
              로그인
            </button>
            <button
              className={`h-10 rounded text-sm font-black transition ${
                !isLoginMode ? "bg-[#d6a84f] text-black" : "text-zinc-300 hover:text-white"
              }`}
              type="button"
              onClick={() => handleModeChange("signup")}
            >
              회원가입
            </button>
          </div>
        </div>

        {isLoginMode ? (
          <LoginPanel signupMessage={signupMessage} onSignupClick={() => handleModeChange("signup")} />
        ) : (
          <SignupPanel
            onLoginClick={() => handleModeChange("login")}
            onSignupSuccess={handleSignupSuccess}
          />
        )}
      </div>
    </section>
  );
};

export default LoginForm;
