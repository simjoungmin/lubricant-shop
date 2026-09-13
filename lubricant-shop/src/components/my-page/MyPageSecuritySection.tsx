import Link from "next/link";

export function MyPageSecuritySection() {
  return (
    <section>
      <h2 className="text-xl font-black text-[#071d3b]">로그인 및 보안</h2>
      <div className="mt-4 border-y border-[#dce2e8]">
        <Link
          href="/my-page/account/password"
          className="grid min-h-14 grid-cols-[140px_1fr_auto] items-center gap-4 border-b border-[#e7ebf0] px-4 py-3 text-sm hover:bg-[#fbfcfd] md:grid-cols-[180px_1fr_auto]"
        >
          <span className="font-black text-[#071d3b]">비밀번호 변경</span>
          <span className="font-bold leading-6 text-[#65717f]">
            주기적으로 비밀번호를 변경해 계정을 안전하게 관리합니다.
          </span>
          <span className="text-xl font-bold text-[#071d3b]" aria-hidden="true">
            ›
          </span>
        </Link>
        <div className="grid min-h-14 grid-cols-[140px_1fr_auto] items-center gap-4 px-4 py-3 text-sm md:grid-cols-[180px_1fr_auto]">
          <span className="font-black text-[#071d3b]">최근 로그인</span>
          <span className="font-bold leading-6 text-[#65717f]">
            최근 로그인 이력 기능은 준비 중입니다.
          </span>
          <span className="text-xs font-black text-[#65717f]">준비 중</span>
        </div>
      </div>
    </section>
  );
}
