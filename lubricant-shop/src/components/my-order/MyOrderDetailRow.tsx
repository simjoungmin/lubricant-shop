type MyOrderDetailRowProps = {
  label: string;
  value: string;
  isHighlight?: boolean;
};

export function MyOrderDetailRow({
  label,
  value,
  isHighlight = false,
}: MyOrderDetailRowProps) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="font-bold text-zinc-500">{label}</dt>
      <dd className={`font-black ${isHighlight ? "text-[#d6a84f]" : "text-white"}`}>
        {value}
      </dd>
    </div>
  );
}
