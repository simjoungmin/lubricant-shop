import React from "react";

const clips = [
  "엔진오일 교체 방법",
  "100℃ 테스트",
  "내 차에 맞는 오일",
  "수입차 오일 추천",
  "정품 확인법",
];

const ShortClipSection = () => {
  return (
    <section className="bg-[#171511] py-12">
      <div className="mx-auto max-w-[1440px] px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#d6a84f]">CONTENTS</p>
            <h2 className="mt-2 text-2xl font-bold">인기 숏클립</h2>
          </div>

          <div className="flex gap-2">
            <button className="rounded-full border border-[#d6a84f]/60 px-4 py-2 text-xs text-[#d6a84f]">
              30초 순삭
            </button>
            <button className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400">
              정비상식
            </button>
            <button className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400">
              1분 테스트
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
          {clips.map((clip) => (
            <article
              key={clip}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-[#1f1b15]"
            >
              <div className="flex aspect-[9/14] items-center justify-center bg-gradient-to-br from-[#383126] to-[#0d0d0b]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-xl backdrop-blur">
                  ▶
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm font-semibold">{clip}</p>
                <p className="mt-1 text-xs text-zinc-500">OIL MASTER</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShortClipSection;