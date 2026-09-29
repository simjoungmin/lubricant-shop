import Image from "next/image";

const OILTIME_NOTICE_IMAGE = "/Common Product Detail Page/oiltime_notice_01.jpg";

export default function OiltimeNoticeImage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[860px] px-4 py-8 sm:px-6 lg:px-0">
        <Image
          src={OILTIME_NOTICE_IMAGE}
          alt="오일타임 상품 상세 공통 안내"
          width={860}
          height={2759}
          sizes="(max-width: 860px) 100vw, 860px"
          className="h-auto w-full"
          priority
        />
      </div>
    </section>
  );
}
