export type AuthProviderName = "email" | "naver" | "kakao";

export type AuthUser = {
  id: string;
  email: string;
  loginId: string;
  name: string;
  provider: AuthProviderName;
  role: "USER" | "ADMIN";
  pointBalance: number;
  phoneNumber: string;
  address: string;
};

export type LoginInput = {
  loginId: string;
  password: string;
};

export type MemberNameUpdateInput = {
  name: string;
};

export type MemberPasswordUpdateInput = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export type MemberResponse = {
  memberId: number;
  email: string;
  loginId: string;
  name: string;
  provider?: "EMAIL" | "NAVER" | "KAKAO";
  role?: "USER" | "ADMIN";
  pointBalance?: number;
  phoneNumber?: string;
  address?: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  socialLogin: (provider: Exclude<AuthProviderName, "email">) => Promise<AuthUser>;
  updateName: (input: MemberNameUpdateInput) => Promise<AuthUser>;
  updatePassword: (input: MemberPasswordUpdateInput) => Promise<void>;
  withdraw: () => Promise<void>;
  logout: () => Promise<void>;
};
