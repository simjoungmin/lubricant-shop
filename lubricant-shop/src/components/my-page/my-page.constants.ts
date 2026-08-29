import type { AuthUser } from "@/components/auth/auth/auth.types";
import type { MyPageLinkItem, MyPagePendingItem } from "./my-page.types";

export const providerLabel: Record<AuthUser["provider"], string> = {
  email: "이메일 로그인",
  kakao: "카카오 로그인",
  naver: "네이버 로그인",
};

export const orderMenuItems: MyPageLinkItem[] = [
  {
    title: "주문 내역",
    description: "주문 번호, 결제 금액, 주문 상태를 확인합니다.",
    href: "/my-page/orders",
  },
  {
    title: "내 문의 확인",
    description: "내가 남긴 문의와 관리자 답변을 확인합니다.",
    href: "/my-page/inquiries",
  },
];

export const pendingOrderMenuItems: MyPagePendingItem[] = [
  {
    title: "배송 현황",
    description: "주문 상세에서 상품 준비, 배송 중, 배송 완료 상태를 확인합니다.",
    status: "주문 상세에서 확인",
  },
];

export const pendingAccountMenuItems: MyPagePendingItem[] = [
  {
    title: "이름 변경",
    description: "주문자와 문의 작성자 이름을 변경합니다.",
    status: "준비 중",
  },
  {
    title: "비밀번호 변경",
    description: "현재 비밀번호 확인 후 새 비밀번호로 변경합니다.",
    status: "준비 중",
  },
  {
    title: "계정 연동",
    description: "이메일, 카카오, 네이버 로그인을 연결합니다.",
    status: "준비 중",
  },
];
