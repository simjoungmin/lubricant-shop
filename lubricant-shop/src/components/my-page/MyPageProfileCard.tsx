import type { AuthUser } from "@/components/auth/auth/auth.types";
import { providerLabel } from "./my-page.constants";

type MyPageProfileCardProps = {
  user: AuthUser;
  onLogout: () => void;
};

export function MyPageProfileCard({ user, onLogout }: MyPageProfileCardProps) {
  const initial = user.name.trim().slice(0, 1).toUpperCase() || "U";

  return (
    <section className="border-b border-[#dce2e8] pb-8">
      <div className="grid gap-6 md:grid-cols-[1fr_180px] md:items-center">
        <div className="grid gap-5 md:grid-cols-[84px_1fr_1fr_1fr] md:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eef2f8] text-3xl font-black text-[#071d3b]">
            {initial}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-black text-[#071d3b]">{user.name}</h2>
            <p className="mt-1 text-sm font-bold text-[#65717f]">일반 회원</p>
          </div>

          <div className="min-w-0 border-[#dce2e8] md:border-l md:pl-8">
            <p className="truncate text-base font-black text-[#071d3b]">{user.email}</p>
            <p className="mt-1 text-sm font-bold text-[#65717f]">{providerLabel[user.provider]}</p>
          </div>

          <div className="border-[#dce2e8] md:border-l md:pl-8">
            <p className="inline-flex items-center gap-2 text-base font-black text-[#071d3b]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#26b262]" />
              정상 이용 중
            </p>
            <p className="mt-1 text-sm font-bold text-[#65717f]">계정 상태</p>
          </div>
        </div>

        <button
          type="button"
          className="h-11 rounded-md border border-[#aab3bf] bg-white px-5 text-sm font-black text-[#071d3b] transition hover:border-[#071d3b]"
          onClick={onLogout}
        >
          로그아웃
        </button>
      </div>
    </section>
  );
}
