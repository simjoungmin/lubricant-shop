"use client";

import LoginPanel from "./LoginPanel";

const LoginForm = () => {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-[1280px] items-center gap-14 px-6 py-14 lg:grid-cols-[1fr_560px] lg:px-8">
      <div className="max-w-xl">
        <p className="mb-4 text-sm font-black text-[#ff4b1f]">OIL MASTER ACCOUNT</p>
        <h1 className="text-4xl font-black leading-tight text-[#071d3b] md:text-5xl">
          필요한 오일을 빠르게 찾고 주문하세요.
        </h1>
        <p className="mt-5 text-base leading-7 text-[#65717f]">
          로그인하면 장바구니, 주문 내역, 관심 상품을 계정과 연결할 수 있습니다.
        </p>
      </div>

      <div className="rounded-lg border border-[#dde2e8] bg-white p-8 shadow-[0_18px_36px_rgba(7,29,59,0.08)]">
        <LoginPanel signupMessage="" />
      </div>
    </section>
  );
};

export default LoginForm;
