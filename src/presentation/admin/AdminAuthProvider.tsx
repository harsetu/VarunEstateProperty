import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AdminUser } from '@/domain/repositories/AdminRepositories';
import { authService } from '@/app/container';

interface AdminAuth {
  /** false when no API is configured for this flavor. */
  available: boolean;
  loading: boolean;
  user: AdminUser | null;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AdminAuth | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(Boolean(authService));

  useEffect(() => {
    if (!authService) return;
    authService.getUser().then(setUser).finally(() => setLoading(false));
    return authService.onChange(setUser);
  }, []);

  const value = useMemo<AdminAuth>(
    () => ({
      available: Boolean(authService),
      loading,
      user,
      signIn: async (identifier, password) => authService!.signIn(identifier, password),
      signOut: async () => authService!.signOut(),
    }),
    [loading, user],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return ctx;
}
