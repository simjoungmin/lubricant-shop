import { formatPrice } from "@/components/cart/cart.utils";
import Button from "@/components/common/Button";
import { PageLayout } from "@/components/common/Layout";
import { productApi } from "@/components/category/product.api";
import OilFooter from "@/components/layout/OilFooter";
import OilHeader from "@/components/layout/OilHeader";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductDetailPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { productId } = await params;
  const parsedProductId = Number(productId);

  if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
    notFound();
  }

  const product = await productApi.findProduct(parsedProductId);

  if (!product) {
    notFound();
  }

  const rewardRate = product.pointRewardRatePercent ?? 0;
  const expectedRewardPoint = Math.floor(product.price * (rewardRate / 100));

  return (
    <PageLayout>
      <OilHeader />
      <main className="bg-[#11100d]">
        <section className="border-b border-white/10 bg-gradient-to-b from-[#1b1a17] to-[#11100d]">
          <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-6 py-4 text-xs text-zinc-500 lg:px-8">
            <Link href="/" className="hover:text-[#d6a84f]">
              홈
            </Link>
            <span>/</span>
            <Link href="/category" className="hover:text-[#d6a84f]">
              상품
            </Link>
            <span>/</span>
            <span className="text-[#d6a84f]">{product.name}</span>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-10 px-6 py-10 lg:grid-cols-[520px_1fr] lg:px-8">
          <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[#252018] to-[#0b0b0a]">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={320}
                height={320}
                className="h-[320px] w-[320px] object-contain"
                priority
              />
            ) : (
              <div
                className="flex h-[260px] w-[160px] items-center justify-center rounded-xl border border-[#d6a84f]/40 text-center text-xl font-black text-white"
                style={{ backgroundColor: product.color }}
              >
                OIL MASTER
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#d6a84f] px-2 py-1 text-xs font-black text-black">
                {product.badge}
              </span>
              {product.brand ? (
                <span className="text-sm font-bold text-zinc-400">
                  {product.brand}
                </span>
              ) : null}
            </div>

            <h1 className="text-3xl font-black leading-tight text-white md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {product.description || "상품 설명이 준비 중입니다."}
            </p>

            <div className="mt-8 grid gap-3 border-y border-white/10 py-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">규격/용량</span>
                <strong className="text-right text-white">
                  {product.spec || "-"}
                </strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">예상 적립</span>
                <strong className="text-[#d6a84f]">
                  {expectedRewardPoint.toLocaleString("ko-KR")} P
                </strong>
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-zinc-500">판매가</p>
                <p className="mt-1 text-3xl font-black text-[#d6a84f]">
                  {formatPrice(product.price)}
                </p>
              </div>
              <Button
                type="cart"
                product={product}
                className="h-12 rounded-md bg-[#d6a84f] px-8 text-sm font-black text-black transition hover:bg-[#f0c76a] hover:text-black"
              >
                장바구니 담기
              </Button>
            </div>
          </div>
        </section>
      </main>
      <OilFooter />
    </PageLayout>
  );
};

export default ProductDetailPage;
