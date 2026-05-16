"use client";

import { useCallback, useEffect, useState } from "react";
import { SessionUser, getSession, logout as logoutFn } from "~~/utils/eventra/auth";

export const useEventraSession = () => {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "eventra:session" || e.key === null) {
        setSession(getSession());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = useCallback(() => {
    logoutFn();
    setSession(null);
  }, []);

  return { session, hydrated, logout };
};
