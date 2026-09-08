export function MyOrdersGuide() {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[#dde2e8] bg-white px-5 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-base font-black text-[#071d3b]">주문 취소 및 반품 안내</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#65717f]">
          상품이 발송되기 전까지 마이페이지에서 주문 상세를 확인할 수 있습니다.
          배송조회는 택배사 연동 후 제공될 예정입니다.
        </p>
      </div>
      <button
        className="h-11 rounded-md border border-[#dce2e8] px-5 text-sm font-black text-[#65717f]"
        type="button"
      >
        자세히 보기
      </button>
    </section>
  );
}
