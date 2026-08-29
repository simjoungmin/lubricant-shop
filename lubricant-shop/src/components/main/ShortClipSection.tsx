import { youtubeShortsApi } from "@/api/youtube-shorts.api";
import Link from "next/link";
import React from "react";

const ShortClipSection = async () => {
  const shorts = await youtubeShortsApi.findChannelShorts();

  return (
    <section className="bg-[#171511] py-12">
      <div className="mx-auto max-w-[1440px] px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#d6a84f]">CONTENTS</p>
            <h2 className="mt-2 text-2xl font-bold">차도락 인기 숏폼</h2>
          </div>

          <Link
            href="https://www.youtube.com/@chadorak/shorts"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[#d6a84f]/60 px-4 py-2 text-xs font-semibold text-[#d6a84f] transition hover:bg-[#d6a84f] hover:text-[#171511]"
          >
            채널 보기
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
          {shorts.map((short) => (
            <article
              key={short.id}
              className="overflow-hidden rounded-lg border border-white/10 bg-[#1f1b15]"
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
                  className="line-clamp-2 text-sm font-semibold transition hover:text-[#d6a84f]"
                >
                  {short.title}
                </Link>
                <p className="mt-1 text-xs text-zinc-500">CHADORAK SHORTS</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShortClipSection;
