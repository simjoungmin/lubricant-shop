import type { ReactNode } from "react";

const paymentInfo = [
  "고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도 있습니다. 확인과정에서 도난 카드의 사용이나 타인 명의의 주문 등 정상적인 주문이 아니라고 판단될 경우 임의로 주문을 보류 또는 취소할 수 있습니다.",
  "무통장 입금은 상품 구매 대금은 PC뱅킹, 인터넷뱅킹, 텔레뱅킹 혹은 가까운 은행에서 직접 입금하시면 됩니다. 주문 시 입력한 입금자명과 실제입금자의 성명이 반드시 일치하여야 하며, 7일 이내로 입금을 하셔야 하며 입금되지 않은 주문은 자동취소 됩니다.",
];

const shippingInfo = [
  "배송 방법 : 택배",
  "배송 지역 : 전국지역",
  "배송 비용 : 무료",
  "배송 기간 : 1일 ~ 7일",
  "배송 안내 : 산간벽지나 도서지방은 별도의 추가금액을 지불하셔야 하는 경우가 있습니다.",
  "고객님께서 주문하신 상품은 입금 확인후 배송해 드립니다. 다만, 상품종류에 따라서 상품의 배송이 다소 지연될 수 있습니다.",
];

const exchangeAddress =
  "[18554] 경기도 화성시 서신면 전곡산단11길 31-25 (주) 토탈알앤씨";

const exchangeRules = [
  "상품을 공급 받으신 날로부터 7일 이내 단, 가전제품의 경우 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우에는 교환/반품이 불가능합니다.",
  "공급받으신 상품 및 용역의 내용이 표시·광고 내용과 다르거나 다르게 이행된 경우에는 공급받은 날로부터 3월 이내, 그 사실을 알게 된 날로부터 30일 이내",
];

const exchangeLimits = [
  "고객님의 책임 있는 사유로 상품등이 멸실 또는 훼손된 경우. 단, 상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외",
  "포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우",
  "고객님의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우. 단, 화장품등의 경우 시용제품을 제공한 경우에 한 합니다.",
  "시간의 경과에 의하여 재판매가 곤란할 정도로 상품등의 가치가 현저히 감소한 경우",
  "복제가 가능한 상품등의 포장을 훼손한 경우",
];

export default function ProductPurchaseGuide() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-8">
        <h2 className="border-b border-[#d7dde5] pb-5 text-lg font-black text-[#071d3b]">
          상품구매안내
        </h2>

        <div className="space-y-12 pt-8 text-[13px] leading-6 text-[#071d3b]">
          <GuideSection title="상품 결제 정보">
            {paymentInfo.map((description) => (
              <p key={description}>{description}</p>
            ))}
          </GuideSection>

          <GuideSection title="배송정보">
            <ul>
              {shippingInfo.map((description) => (
                <li key={description}>{description}</li>
              ))}
            </ul>
          </GuideSection>

          <GuideSection title="교환 및 반품정보">
            <div>
              <p>[교환 및 반품 주소]</p>
              <p>- {exchangeAddress}</p>
            </div>

            <div>
              <p>[교환 및 반품이 가능한 경우]</p>
              <ul>
                {exchangeRules.map((description) => (
                  <li key={description}>- {description}</li>
                ))}
              </ul>
            </div>

            <div>
              <p>[교환 및 반품이 불가능한 경우]</p>
              <ul>
                {exchangeLimits.map((description) => (
                  <li key={description}>- {description}</li>
                ))}
              </ul>
            </div>

            <p>
              ※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품반송 비용은
              고객님께서 부담하셔야 합니다. (색상 교환, 사이즈 교환 등 포함)
            </p>
          </GuideSection>
        </div>
      </div>
    </section>
  );
}

function GuideSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <h3 className="text-base font-black text-[#071d3b]">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
