export type AuthProviderName = "email" | "naver" | "kakao";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  provider: AuthProviderName;
  role: "USER" | "ADMIN";
  pointBalance: number;
};

export type EmailLoginInput = {
  email: string;
  password: string;
};

export type MemberResponse = {
  memberId: number;
  email: string;
  name: string;
  provider?: "EMAIL" | "NAVER" | "KAKAO";
  role?: "USER" | "ADMIN";
  pointBalance?: number;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  login: (input: EmailLoginInput) => Promise<AuthUser>;
  socialLogin: (provider: Exclude<AuthProviderName, "email">) => Promise<AuthUser>;
  logout: () => Promise<void>;
};
