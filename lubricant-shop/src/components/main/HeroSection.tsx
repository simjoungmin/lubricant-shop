"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const banners = [
  {
    id: 1,
    src: "/main-banner/oil-specialist.png",
    alt: "오일마스터 엔진오일 전문 배너",
  },
  {
    id: 2,
    src: "/main-banner/opening-sale.png",
    alt: "오픈 기념 전 품목 20% 할인 배너",
  },
  {
    id: 3,
    src: "/main-banner/kia-collaboration.png",
    alt: "기아 자동차 컬래버레이션 배너",
  },
];

const AUTO_PLAY_DELAY = 5000;

const HeroSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const moveToBanner = useCallback((index: number) => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    slider.scrollTo({
      left: slider.clientWidth * index,
      behavior: "smooth",
    });

    setActiveIndex(index);
  }, []);

  const moveToPrevious = () => {
    const previousIndex =
      activeIndex === 0 ? banners.length - 1 : activeIndex - 1;

    moveToBanner(previousIndex);
  };

  const moveToNext = useCallback(() => {
    const nextIndex =
      activeIndex === banners.length - 1 ? 0 : activeIndex + 1;

    moveToBanner(nextIndex);
  }, [activeIndex, moveToBanner]);

  const handleScroll = () => {
    const slider = sliderRef.current;

    if (!slider || slider.clientWidth === 0) {
      return;
    }

    const nextIndex = Math.round(slider.scrollLeft / slider.clientWidth);

    setActiveIndex(Math.min(nextIndex, banners.length - 1));
  };

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = window.setInterval(moveToNext, AUTO_PLAY_DELAY);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, moveToNext]);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#f4f4f4]"
      aria-label="메인 프로모션 배너"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="relative aspect-[16/7] min-w-full shrink-0 snap-center sm:aspect-[16/6] lg:aspect-[16/5]"
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="select-none object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={moveToPrevious}
        aria-label="이전 배너 보기"
        className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-2xl text-white backdrop-blur-sm transition hover:bg-black/60 sm:flex lg:left-7"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <button
        type="button"
        onClick={moveToNext}
        aria-label="다음 배너 보기"
        className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-2xl text-white backdrop-blur-sm transition hover:bg-black/60 sm:flex lg:right-7"
      >
        <span aria-hidden="true">›</span>
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => moveToBanner(index)}
            aria-label={`${index + 1}번째 배너 보기`}
            aria-current={activeIndex === index}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "w-7 bg-white"
                : "w-2 bg-white/55 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm lg:right-8">
        {activeIndex + 1} / {banners.length}
      </div>
    </section>
  );
};

export default HeroSection;