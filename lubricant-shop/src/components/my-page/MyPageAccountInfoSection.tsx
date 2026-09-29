import type { AuthUser } from "@/components/auth/auth/auth.types";
import Link from "next/link";

type AccountInfoRow = {
  label: string;
  value: string;
  href?: string;
  onClick?: () => void;
  actionAriaLabel?: string;
};

type MyPageAccountInfoSectionProps = {
  user: AuthUser;
  onChangeAddress: () => void;
  isAddressUpdating: boolean;
};

const emptyValue = "등록된 정보가 없습니다.";

export function MyPageAccountInfoSection({
  user,
  onChangeAddress,
  isAddressUpdating,
}: MyPageAccountInfoSectionProps) {
  const accountInfoRows: AccountInfoRow[] = [
    {
      label: "이름",
      value: user.name,
      href: "/my-page/account/name",
      actionAriaLabel: "이름 변경",
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
      onClick: onChangeAddress,
      actionAriaLabel: "기본 배송지 변경",
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
            <AccountInfoAction row={row} isLoading={isAddressUpdating && Boolean(row.onClick)} />
          </div>
        ))}
      </div>
    </section>
  );
}

function AccountInfoAction({
  row,
  isLoading,
}: {
  row: AccountInfoRow;
  isLoading: boolean;
}) {
  const actionClassName =
    "inline-flex h-8 w-8 items-center justify-center rounded-full text-xl font-black text-[#071d3b] transition hover:bg-[#eef2f8] disabled:cursor-not-allowed disabled:opacity-50";

  if (row.href) {
    return (
      <Link href={row.href} className={actionClassName} aria-label={row.actionAriaLabel}>
        &gt;
      </Link>
    );
  }

  if (row.onClick) {
    return (
      <button
        type="button"
        className={actionClassName}
        aria-label={row.actionAriaLabel}
        disabled={isLoading}
        onClick={row.onClick}
      >
        &gt;
      </button>
    );
  }

  return <span aria-hidden="true" className="w-8" />;
}
