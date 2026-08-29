import type { AuthUser } from "@/components/auth/auth/auth.types";
import Link from "next/link";
import { providerLabel } from "./my-page.constants";

type MyPageProfileCardProps = {
  user: AuthUser;
  onLogout: () => void;
};

export function MyPageProfileCard({ user, onLogout }: MyPageProfileCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#171611] p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-bold text-zinc-400">환영합니다</p>
          <h2 className="mt-2 text-2xl font-black text-white">{user.name}</h2>
          <p className="mt-2 text-sm font-bold text-zinc-400">{user.email}</p>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2 md:min-w-[360px]">
          <div className="rounded-md border border-white/10 bg-black/20 p-4">
            <p className="font-bold text-zinc-400">로그인 방식</p>
            <p className="mt-2 font-black text-white">{providerLabel[user.provider]}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/20 p-4">
            <p className="font-bold text-zinc-400">보유 포인트</p>
            <p className="mt-2 font-black text-[#d6a84f]">
              {user.pointBalance.toLocaleString("ko-KR")} P
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/"
          className="flex h-11 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
        >
          쇼핑 계속하기
        </Link>
        <button
          type="button"
          className="h-11 rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
          onClick={onLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
