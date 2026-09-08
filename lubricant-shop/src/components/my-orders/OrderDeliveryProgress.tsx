import type { OrderStatus } from "@/components/admin/admin.api";

const steps = [
  { key: "ORDERED", label: "주문완료" },
  { key: "PAID", label: "결제완료" },
  { key: "PREPARING", label: "상품준비" },
  { key: "SHIPPING", label: "배송중" },
  { key: "DELIVERED", label: "배송완료" },
] as const;

const activeStepIndexByStatus: Record<OrderStatus, number> = {
  ORDERED: 0,
  PAID: 1,
  PREPARING: 2,
  SHIPPING: 3,
  DELIVERED: 4,
  CANCELED: -1,
};

type OrderDeliveryProgressProps = {
  orderStatus: OrderStatus;
};

export function OrderDeliveryProgress({ orderStatus }: OrderDeliveryProgressProps) {
  const activeStepIndex = activeStepIndexByStatus[orderStatus];
  const isCanceled = orderStatus === "CANCELED";

  return (
    <div className="rounded-lg bg-[#f8fafb] p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-black text-[#071d3b]">
            {isCanceled ? "주문 취소" : "배송 정보"}
          </p>
          <p className="mt-1 text-sm font-bold text-[#ff4b1f]">
            택배사 연동 전까지 배송조회는 준비 중입니다.
          </p>
        </div>
        <span className="text-sm font-black text-[#65717f]">도착 예정일 준비 중</span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => {
          const isDone = !isCanceled && index <= activeStepIndex;

          return (
            <div key={step.key} className="grid gap-2 text-center">
              <span
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                  isDone ? "bg-[#ff4b1f] text-white" : "bg-[#dde2e8] text-[#65717f]"
                }`}
              >
                {index + 1}
              </span>
              <span className={`text-xs font-black ${isDone ? "text-[#071d3b]" : "text-[#8a95a3]"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-md border border-[#dde2e8] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-[#65717f]">
          택배사와 운송장 번호는 관리자 배송 연동 후 표시됩니다.
        </p>
        <button
          className="h-10 cursor-not-allowed rounded-md bg-[#dce2e8] px-5 text-sm font-black text-[#65717f]"
          disabled
          type="button"
        >
          배송조회 준비 중
        </button>
      </div>
    </div>
  );
}
