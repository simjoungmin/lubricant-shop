export function MyOrdersFilterBar() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-black text-[#071d3b]">주문 내역</h2>
        <p className="mt-2 text-sm font-semibold text-[#65717f]">
          최근 주문을 먼저 보여드리고 이전 주문은 표로 정리했습니다.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="h-10 rounded-md bg-[#071d3b] px-4 text-sm font-black text-white" type="button">
          최근 3개월
        </button>
        <button className="h-10 rounded-md border border-[#dce2e8] bg-white px-4 text-sm font-black text-[#34465c]" type="button">
          6개월
        </button>
        <button className="h-10 rounded-md border border-[#dce2e8] bg-white px-4 text-sm font-black text-[#34465c]" type="button">
          1년
        </button>
        <button className="h-10 rounded-md border border-[#dce2e8] bg-white px-4 text-sm font-black text-[#34465c]" type="button">
          조회
        </button>
      </div>
    </div>
  );
}
