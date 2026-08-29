import type { ReactNode } from "react";

export function AdminOrderInfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171611] p-5">
      <h2 className="text-xl font-black text-white">{title}</h2>
      <div className="mt-5 grid gap-3">{children}</div>
    </section>
  );
}

export function AdminOrderInfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1">
      <p className="text-xs font-bold text-zinc-500">{label}</p>
      <p className="text-sm font-bold leading-6 text-zinc-200">{value}</p>
    </div>
  );
}
