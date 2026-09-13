import type { AuthUser } from "@/components/auth/auth/auth.types";
import Link from "next/link";

type AccountInfoRow = {
  label: string;
  value: string;
  href?: string;
  actionLabel?: string;
};

type MyPageAccountInfoSectionProps = {
  user: AuthUser;
};

const emptyValue = "등록된 정보가 없습니다.";

export function MyPageAccountInfoSection({ user }: MyPageAccountInfoSectionProps) {
  const accountInfoRows: AccountInfoRow[] = [
    {
      label: "이름",
      value: user.name,
      href: "/my-page/account/name",
      actionLabel: "변경",
    },
    {
      label: "이메일",
      value: user.email,
    },
    {
      label: "휴대폰",
      value: user.phoneNumber || emptyValue,
    },
    {
      label: "기본 배송지",
      value: user.address || emptyValue,
    },
  ];

  return (
    <section>
      <h2 className="text-xl font-black text-[#071d3b]">회원 정보</h2>
      <div className="mt-4 border-y border-[#dce2e8]">
        {accountInfoRows.map((row) => (
          <div
            key={row.label}
            className="grid min-h-14 grid-cols-[110px_1fr_auto] items-center gap-4 border-b border-[#e7ebf0] px-4 py-3 text-sm last:border-b-0 md:grid-cols-[180px_1fr_auto]"
          >
            <p className="font-black text-[#071d3b]">{row.label}</p>
            <p className="min-w-0 break-words font-bold text-[#65717f]">{row.value}</p>
            {row.href && row.actionLabel ? (
              <Link href={row.href} className="font-black text-[#071d3b] underline-offset-4 hover:underline">
                {row.actionLabel}
              </Link>
            ) : (
              <span aria-hidden="true" className="w-7" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
