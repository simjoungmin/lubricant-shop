import { productApi } from "@/components/category/product.api";
import { PageLayout } from "@/components/common/Layout";
import { ProductImage, PRODUCT_IMAGE_SIZES } from "@/components/common/ProductImage";
import OilHeader from "@/components/layout/OilHeader";
import OiltimeNoticeImage from "@/components/product-detail/OiltimeNoticeImage";
import ProductDetailPurchasePanel from "@/components/product-detail/ProductDetailPurchasePanel";
import ProductPurchaseGuide from "@/components/product-detail/ProductPurchaseGuide";
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

  return (
    <PageLayout>
      <OilHeader />
      <main className="bg-white">
        <section className="border-b border-[#e2e6eb] bg-white">
          <div className="mx-auto flex max-w-[1000px] items-center gap-2 px-6 py-4 text-xs font-semibold text-[#7a8490] lg:px-0">
            <Link href="/" className="hover:text-[#2276dc]">
              홈
            </Link>
            <span>/</span>
            <Link href="/category" className="hover:text-[#2276dc]">
              상품
            </Link>
            <span>/</span>
            <span className="truncate text-[#111827]">{product.name}</span>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1000px] gap-10 px-6 py-8 lg:grid-cols-[560px_400px] lg:px-0 lg:py-10">
          <div>
            <div className="flex h-[500px] items-center justify-center border border-[#dfe5ec] bg-white">
              <div className="relative h-[390px] w-full max-w-[430px] overflow-hidden">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  sizes={PRODUCT_IMAGE_SIZES.detail}
                  fallbackColor={product.color}
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <div className="relative h-[60px] w-[60px] border border-[#111827] bg-white">
                <ProductImage
                  src={product.imageUrl}
                  alt={`${product.name} 썸네일`}
                  sizes="60px"
                  fallbackColor={product.color}
                  className="object-contain p-1"
                />
              </div>
            </div>
          </div>

          <ProductDetailPurchasePanel product={product} />
        </section>

        <section className="mx-auto max-w-[1000px] px-6 pt-8 lg:px-0">
          <nav className="grid grid-cols-3 border-b border-[#d8dee6] text-center text-sm text-[#777]">
            <a
              href="#product-info"
              className="border-b-2 border-[#222] py-4 font-black text-[#111827]"
            >
              상품정보
            </a>
            <a href="#purchase-guide" className="py-4 font-medium">
              상품구매안내
            </a>
            <a href="#product-reviews" className="py-4 font-medium">
              상품후기(0)
            </a>
          </nav>
        </section>

        <section id="product-info">
          <OiltimeNoticeImage />
        </section>

        {/*
          상품안내는 제품별 상세 콘텐츠가 준비되면 이 위치에 추가합니다.
          <section className="mx-auto max-w-[1000px] px-6 py-12 lg:px-0" />
        */}

        <section
          id="product-reviews"
          className="mx-auto max-w-[1000px] px-6 py-12 lg:px-0"
        >
          <h2 className="sr-only">상품후기</h2>
        </section>

        <section id="purchase-guide">
          <ProductPurchaseGuide />
        </section>
      </main>
    </PageLayout>
  );
};

export default ProductDetailPage;
