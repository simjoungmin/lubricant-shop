"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";

export function useAdminAccess() {
  const { user, isReady } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return {
    user,
    isReady,
    isAdmin,
    showLoginLink: isReady && !isAdmin,
  };
}
