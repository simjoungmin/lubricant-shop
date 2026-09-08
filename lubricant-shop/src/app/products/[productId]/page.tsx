import { formatPrice, getDiscountRate } from "@/components/cart/cart.utils";
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
  const discountRate = getDiscountRate(product.originalPrice, product.price);

  return (
    <PageLayout>
      <OilHeader />
      <main className="bg-[#f7f7f5]">
        <section className="border-b border-[#e2e6eb] bg-white">
          <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-6 py-4 text-xs font-semibold text-[#7a8490] lg:px-8">
            <Link href="/" className="hover:text-[#ff4b1f]">
              홈
            </Link>
            <span>/</span>
            <Link href="/category" className="hover:text-[#ff4b1f]">
              상품
            </Link>
            <span>/</span>
            <span className="text-[#ff4b1f]">{product.name}</span>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-10 px-6 py-10 lg:grid-cols-[520px_1fr] lg:px-8">
          <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-[#dde2e8] bg-white">
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
                className="flex h-[260px] w-[160px] items-center justify-center rounded-xl border border-[#dce2e8] text-center text-xl font-black text-white"
                style={{ backgroundColor: product.color }}
              >
                OIL MASTER
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#ff4b1f] px-2 py-1 text-xs font-black text-white">
                {product.badge}
              </span>
              {product.brand ? (
                <span className="text-sm font-bold text-[#65717f]">
                  {product.brand}
                </span>
              ) : null}
            </div>

            <h1 className="text-3xl font-black leading-tight text-[#071d3b] md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#65717f]">
              {product.description || "상품 설명을 준비 중입니다."}
            </p>

            <div className="mt-8 grid gap-3 border-y border-[#e2e6eb] py-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#65717f]">규격/용량</span>
                <strong className="text-right text-[#071d3b]">
                  {product.spec || "-"}
                </strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#65717f]">예상 적립</span>
                <strong className="text-[#ff4b1f]">
                  {expectedRewardPoint.toLocaleString("ko-KR")} P
                </strong>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold text-[#65717f]">판매가</p>
                {discountRate > 0 ? (
                  <p className="mt-1 text-sm font-bold text-[#8a94a1] line-through">
                    {formatPrice(product.originalPrice ?? product.price)}
                  </p>
                ) : null}
                <div className="mt-1 flex items-baseline gap-3">
                  {discountRate > 0 ? (
                    <span className="text-3xl font-black text-[#ff4b1f]">
                      {discountRate}%
                    </span>
                  ) : null}
                  <p className="text-3xl font-black text-[#071d3b]">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
              <Button
                type="cart"
                product={product}
                className="h-12 rounded-md bg-[#ff4b1f] px-8 text-sm font-black text-white transition hover:bg-[#e63e16]"
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
