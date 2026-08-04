"use client";

import { useEffect, useMemo, useState } from "react";
import { authApi } from "../auth/auth.api";
import { toAuthUser } from "../auth/auth.mapper";
import type { AuthContextValue, AuthUser } from "../auth/auth.types";

export const useAuthState = (): AuthContextValue => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreUser = async () => {
      try {
        const member = await authApi.me();

        if (isMounted) {
          setUser(toAuthUser(member));
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    void restoreUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      login: async (input) => {
        const member = await authApi.login(input);
        const nextUser = toAuthUser(member);
        setUser(nextUser);

        return nextUser;
      },
      socialLogin: async (provider) => {
        authApi.startSocialLogin(provider);
        return new Promise<AuthUser>(() => undefined);
      },
      logout: async () => {
        await authApi.logout();
        setUser(null);
      },
    }),
    [isReady, user],
  );
};