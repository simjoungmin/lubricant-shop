import type { AuthUser } from "@/components/auth/auth/auth.types";

type MyPageAccountSummaryProps = {
  user: AuthUser;
};

type SummaryIcon = "user" | "email" | "crown" | "shield";

type AccountSummaryItem = {
  icon: SummaryIcon;
  label: string;
  value: string;
  isStatus?: boolean;
};

const accountTypeLabel: Record<AuthUser["provider"], string> = {
  email: "일반 회원",
  kakao: "카카오 회원",
  naver: "네이버 회원",
};

function SummaryIconView({ icon }: { icon: SummaryIcon }) {
  const iconClassName = "h-7 w-7 text-[#071d3b]";

  if (icon === "user") {
    return (
      <svg aria-hidden="true" className="h-10 w-10 text-[#7e8daa]" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="7.5" r="4.2" />
        <path d="M4.5 20.5c.8-4.1 3.7-6.4 7.5-6.4s6.7 2.3 7.5 6.4H4.5Z" />
      </svg>
    );
  }

  if (icon === "email") {
    return (
      <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="m5 8 7 5 7-5" />
      </svg>
    );
  }

  if (icon === "crown") {
    return (
      <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="m5 16 1.7-8 4.2 4.2L12 6l1.1 6.2L17.3 8 19 16H5Z" />
        <path d="M6 19h12" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M12 3.5 19 6v5.6c0 4.3-2.8 7.4-7 8.9-4.2-1.5-7-4.6-7-8.9V6l7-2.5Z" />
      <path d="m9.5 12 1.7 1.7 3.6-4" />
    </svg>
  );
}

export function MyPageAccountSummary({ user }: MyPageAccountSummaryProps) {
  const accountItems: AccountSummaryItem[] = [
    { icon: "user", label: "회원명", value: user.name },
    { icon: "email", label: "이메일", value: user.email },
    { icon: "crown", label: "가입 유형", value: accountTypeLabel[user.provider] },
    { icon: "shield", label: "보안 상태", value: "정상", isStatus: true },
  ];

  return (
    <section className="overflow-hidden rounded-lg border border-[#dce2e8] bg-white shadow-[0_12px_28px_rgba(7,29,59,0.04)]">
      <div className="grid md:grid-cols-4">
        {accountItems.map((item) => (
          <div
            key={item.label}
            className="flex min-w-0 items-center gap-5 border-b border-[#e6ebf1] px-6 py-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#eef2f8]">
              <SummaryIconView icon={item.icon} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-[#7a8490]">{item.label}</p>
              <p className="mt-2 truncate text-base font-black text-[#071d3b]">
                {item.isStatus ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#26b262]" />
                    {item.value}
                  </span>
                ) : (
                  item.value
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
