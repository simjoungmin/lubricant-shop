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
      <dt className="font-bold text-[#65717f]">{label}</dt>
      <dd className={`text-right font-black ${isHighlight ? "text-[#ff4b1f]" : "text-[#071d3b]"}`}>
        {value}
      </dd>
    </div>
  );
}
