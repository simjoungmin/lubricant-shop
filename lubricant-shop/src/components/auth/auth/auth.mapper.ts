import type { AuthProviderName, AuthUser, MemberResponse } from "./auth.types";

const providerMap: Record<NonNullable<MemberResponse["provider"]>, AuthProviderName> = {
  EMAIL: "email",
  NAVER: "naver",
  KAKAO: "kakao",
};

export const toAuthUser = (member: MemberResponse): AuthUser => ({
  id: String(member.memberId),
  email: member.email,
  loginId: member.loginId,
  name: member.name,
  provider: member.provider ? providerMap[member.provider] : "email",
  role: member.role ?? "USER",
  pointBalance: member.pointBalance ?? 0,
  phoneNumber: member.phoneNumber ?? "",
  address: member.address ?? "",
});
