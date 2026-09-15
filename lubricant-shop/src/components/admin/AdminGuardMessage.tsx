import Link from "next/link";

export type AdminNoticeVariant = "error" | "info" | "success";

type AdminGuardMessageProps = {
  message: string;
  showLoginLink?: boolean;
  className?: string;
  variant?: AdminNoticeVariant;
};

const variantClassNames: Record<AdminNoticeVariant, string> = {
  error: "border-red-500/30 bg-red-500/10 text-red-200",
  info: "border-white/10 bg-[#171611] text-zinc-300",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
};

export function AdminGuardMessage({
  message,
  showLoginLink = false,
  className = "",
  variant = "info",
}: AdminGuardMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <section
      className={`rounded-lg border p-5 ${variantClassNames[variant]} ${className}`.trim()}
      role={variant === "error" ? "alert" : "status"}
    >
      <p className="text-sm font-bold">{message}</p>
      {showLoginLink ? (
        <Link
          href="/login"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
        >
          로그인하러 가기
        </Link>
      ) : null}
    </section>
  );
}
