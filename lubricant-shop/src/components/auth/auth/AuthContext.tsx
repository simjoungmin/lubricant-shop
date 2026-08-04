"use client";

import React, { createContext, useContext } from "react";
import { useAuthState } from "../use/useAuthState";
import type { AuthContextValue } from "./auth.types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuthState();

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서 사용해야 합니다.");
  }

  return context;
}

export type { AuthProviderName, AuthUser } from "./auth.types";
