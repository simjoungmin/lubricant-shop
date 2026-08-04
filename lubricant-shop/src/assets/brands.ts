export type BrandPillar = {
  title: string;
  description: string;
};

export type PartnerHighlight = {
  label: string;
  value: string;
};

export const companyBrand = {
  name: "OIL MASTER",
  eyebrow: "PREMIUM IMPORTED FUEL & OIL CURATION",
  headline: "해외에서 검증된 고급 윤활유와 프리미엄 휘발유 솔루션을 가장 세련된 기준으로 선별합니다.",
  description:
    "OIL MASTER는 고성능 차량과 섬세한 정비 환경을 위해 해외 프리미엄 오일, 케미컬, 고급 휘발유 관련 제품을 직접 소싱하고 국내 고객에게 안정적으로 공급하는 수입 유통 브랜드입니다.",
  refinedCopy:
    "좋은 연료와 좋은 오일은 차의 반응을 바꿉니다. 우리는 단순히 제품을 판매하는 것이 아니라, 엔진이 더 부드럽게 회전하고 주행이 더 선명해지는 경험을 고릅니다.",
  partnerCopy:
    "국내 정비 네트워크와 유통 기업과의 협업을 통해 수입 제품의 품질 기준, 재고 안정성, 사후 대응까지 하나의 흐름으로 관리합니다.",
};

export const brandPillars: BrandPillar[] = [
  {
    title: "Premium Fuel",
    description: "고급 휘발유와 연료첨가제 시장의 흐름을 반영해 엔진 컨디션 관리에 맞는 제품을 제안합니다.",
  },
  {
    title: "Imported Oil",
    description: "유럽과 미국에서 검증된 엔진오일, 미션오일, 케미컬 제품을 엄선해 국내 차량 환경에 맞게 소개합니다.",
  },
  {
    title: "Trusted Supply",
    description: "국내 파트너사와 손잡고 정비소, 고객, 유통 채널이 모두 신뢰할 수 있는 공급 체계를 구축합니다.",
  },
];

export const partnerHighlights: PartnerHighlight[] = [
  { label: "국내 협력사", value: "정비 네트워크" },
  { label: "수입 기준", value: "정품 유통" },
  { label: "관리 영역", value: "품질 및 재고" },
];
