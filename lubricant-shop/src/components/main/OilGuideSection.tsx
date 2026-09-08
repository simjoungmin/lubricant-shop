import React from "react";

const ratingOptions = ["5", "4", "3", "2", "1"];

const OilGuideSection = () => {
  return (
    <section className="bg-[#f7f7f5] py-8">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div className="grid gap-8 border border-[#dde2e8] bg-white p-6 md:grid-cols-[0.9fr_1.4fr] md:p-8">
          <div>
            <p className="text-xs font-black uppercase text-[#ff4b1f]">Review</p>
            <h2 className="mt-2 text-2xl font-black">상품 리뷰 남기기</h2>
            <p className="mt-4 leading-7 text-[#65717f]">
              사용한 오일의 체감, 배송 상태, 차량과의 궁합을 남겨주세요. 다른 고객이
              내 차에 맞는 제품을 고르는 데 큰 도움이 됩니다.
            </p>
          </div>

          <form className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-black">
                이름
                <input
                  type="text"
                  placeholder="홍길동"
                  className="h-12 rounded border border-[#dce2e8] px-4 text-sm font-semibold outline-none transition placeholder:text-[#a4adb8] focus:border-[#071d3b]"
                />
              </label>

              <label className="grid gap-2 text-sm font-black">
                평점
                <select className="h-12 rounded border border-[#dce2e8] px-4 text-sm font-semibold outline-none transition focus:border-[#071d3b]">
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}점
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-black">
              구매 상품
              <input
                type="text"
                placeholder="예: 모빌1 FS 5W-30"
                className="h-12 rounded border border-[#dce2e8] px-4 text-sm font-semibold outline-none transition placeholder:text-[#a4adb8] focus:border-[#071d3b]"
              />
            </label>

            <label className="grid gap-2 text-sm font-black">
              리뷰 내용
              <textarea
                rows={5}
                placeholder="제품 사용 후기를 입력해 주세요."
                className="resize-none rounded border border-[#dce2e8] px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-[#a4adb8] focus:border-[#071d3b]"
              />
            </label>

            <button
              type="submit"
              className="h-12 rounded bg-[#071d3b] px-6 text-sm font-black text-white transition hover:bg-[#12345f] md:justify-self-end"
            >
              리뷰 등록
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OilGuideSection;
