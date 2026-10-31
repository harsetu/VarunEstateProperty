import type { AdminUser } from '@/domain/repositories/AdminRepositories';
import flavor from '@/flavors';

const KEY = `admin-session:${flavor.id}`;
export interface Session { accessToken: string; refreshToken?: string; user: AdminUser }
const listeners = new Set<(user: AdminUser | null) => void>();

export const adminSession = {
  get(): Session | null {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? 'null');
    } catch {
      return null;
    }
  },
  set(session: Session | null) {
    try {
      if (session) localStorage.setItem(KEY, JSON.stringify(session));
      else localStorage.removeItem(KEY);
    } catch { /* storage blocked: session lasts until reload */ }
    listeners.forEach((l) => l(session?.user ?? null));
  },
  subscribe(listener: (user: AdminUser | null) => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
};
