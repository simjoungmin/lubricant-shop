export type InquiryTopic = {
  id: string;
  label: string;
  helper: string;
};

export type InquiryGroup = {
  id: string;
  label: string;
  topics: InquiryTopic[];
};

export type InquiryCategory = {
  id: string;
  label: string;
  description: string;
  groups: InquiryGroup[];
};

export const inquiryCategories: InquiryCategory[] = [
  {
    id: "delivery",
    label: "배송",
    description: "출고, 배송 조회, 파손 및 누유 접수",
    groups: [
      {
        id: "tracking",
        label: "배송 조회",
        topics: [
          { id: "delay", label: "배송 지연", helper: "주문번호와 수령 지역을 함께 남겨주세요." },
          { id: "address", label: "배송지 변경", helper: "출고 전 주문만 변경 가능 여부를 확인합니다." },
        ],
      },
      {
        id: "damage",
        label: "배송 문제",
        topics: [
          { id: "leak", label: "오일 누유", helper: "박스와 상품 사진을 첨부하면 빠르게 확인할 수 있습니다." },
          { id: "broken", label: "파손 상품", helper: "파손 부위가 보이는 사진을 첨부해주세요." },
        ],
      },
    ],
  },
  {
    id: "product",
    label: "상품 문의",
    description: "차종 적합성, 점도, 규격, 재고 확인",
    groups: [
      {
        id: "fit",
        label: "차량 적합성",
        topics: [
          { id: "oil-fit", label: "오일 추천", helper: "차량명, 연식, 엔진 타입을 적어주세요." },
          { id: "spec", label: "승인 규격 확인", helper: "필요한 제조사 규격을 함께 남겨주세요." },
        ],
      },
      {
        id: "stock",
        label: "구매 정보",
        topics: [
          { id: "stock-check", label: "재고 확인", helper: "상품명과 희망 수량을 알려주세요." },
          { id: "bulk", label: "대량 구매", helper: "납품 지역과 예상 구매 수량을 남겨주세요." },
        ],
      },
    ],
  },
  {
    id: "order",
    label: "주문/결제",
    description: "결제 확인, 주문 변경, 현금영수증",
    groups: [
      {
        id: "payment",
        label: "결제",
        topics: [
          { id: "payment-check", label: "결제 확인", helper: "결제 시간과 주문자명을 함께 남겨주세요." },
          { id: "receipt", label: "증빙 서류", helper: "현금영수증 또는 세금계산서 정보를 적어주세요." },
        ],
      },
      {
        id: "order-change",
        label: "주문 변경",
        topics: [
          { id: "cancel", label: "주문 취소", helper: "출고 전 주문만 취소 가능 여부를 확인합니다." },
          { id: "option", label: "상품 옵션 변경", helper: "변경 희망 상품명과 수량을 알려주세요." },
        ],
      },
    ],
  },
  {
    id: "return",
    label: "교환/반품",
    description: "미개봉 반품, 오배송, 차종 부적합",
    groups: [
      {
        id: "exchange",
        label: "교환",
        topics: [
          { id: "wrong-item", label: "오배송", helper: "받은 상품과 주문 상품이 보이게 사진을 첨부해주세요." },
          { id: "not-fit", label: "차종 부적합", helper: "차량 정보와 구매 상품명을 남겨주세요." },
        ],
      },
      {
        id: "return",
        label: "반품",
        topics: [
          { id: "unopened", label: "미개봉 반품", helper: "수령일과 상품 상태를 알려주세요." },
          { id: "refund", label: "환불 확인", helper: "반품 접수번호 또는 주문번호를 남겨주세요." },
        ],
      },
    ],
  },
  {
    id: "partner",
    label: "B2B/제휴",
    description: "정비소 납품, 국내 기업 협업, 수입 제품 공급",
    groups: [
      {
        id: "business",
        label: "기업 문의",
        topics: [
          { id: "garage", label: "정비소 납품", helper: "사업자 정보와 취급 희망 품목을 남겨주세요." },
          { id: "company", label: "국내 기업 협업", helper: "회사 소개와 제휴 희망 내용을 적어주세요." },
        ],
      },
      {
        id: "import",
        label: "수입/공급",
        topics: [
          { id: "supply", label: "공급 계약", helper: "브랜드, 품목, 공급 가능 수량을 알려주세요." },
          { id: "authentic", label: "정품 유통 확인", helper: "상품명과 구매 경로를 함께 남겨주세요." },
        ],
      },
    ],
  },
];
