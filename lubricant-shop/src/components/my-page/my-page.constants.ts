import type { AuthUser } from "@/components/auth/auth/auth.types";
import type { MyPageLinkItem } from "./my-page.types";

export const providerLabel: Record<AuthUser["provider"], string> = {
  email: "이메일 로그인",
  kakao: "카카오 로그인",
  naver: "네이버 로그인",
};

export const accountMenuItems: MyPageLinkItem[] = [
  {
    title: "이름 변경",
    description: "주문자와 문의 작성자에 표시되는 회원 이름을 수정합니다.",
    href: "/my-page/account/name",
  },
  {
    title: "비밀번호 변경",
    description: "계정 보안을 위해 현재 비밀번호 확인 후 새 비밀번호로 변경합니다.",
    href: "/my-page/account/password",
  },
];
