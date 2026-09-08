import { youtubeShortsApi } from "@/api/youtube-shorts.api";
import Link from "next/link";
import React from "react";

const ShortClipSection = async () => {
  const shorts = await youtubeShortsApi.findChannelShorts();

  return (
    <section className="bg-[#f7f7f5] py-8">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-[#ff4b1f]">Shortform</p>
            <h2 className="mt-2 text-2xl font-black">차도락 인기 숏폼</h2>
          </div>

          <Link
            href="https://www.youtube.com/@chadorak/shorts"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-[#aab3bf] bg-white px-4 py-2 text-xs font-black text-[#071d3b] transition hover:border-[#ff4b1f] hover:text-[#ff4b1f]"
          >
            채널 보기
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {shorts.map((short) => (
            <article
              key={short.id}
              className="overflow-hidden rounded border border-[#dde2e8] bg-white"
            >
              <iframe
                src={short.embedUrl}
                title={short.title}
                className="aspect-[9/16] w-full bg-black"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />

              <div className="p-4">
                <Link
                  href={short.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="line-clamp-2 text-sm font-black transition hover:text-[#ff4b1f]"
                >
                  {short.title}
                </Link>
                <p className="mt-1 text-xs font-semibold text-[#8a94a1]">CHADORAK SHORTS</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShortClipSection;
