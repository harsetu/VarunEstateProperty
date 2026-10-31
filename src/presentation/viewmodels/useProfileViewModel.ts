import { useEffect, useState } from 'react';
import type { Profile } from '@/domain/note';
import { profileRepository } from '@/app/container';
import { useAdminAuth } from '@/presentation/admin/AdminAuthProvider';
import { t } from '@/i18n';

export function useProfileViewModel() {
  const { signOut } = useAdminAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    profileRepository?.get()
      .then(setProfile)
      .catch((e: unknown) => setMessage({ kind: 'error', text: e instanceof Error ? e.message : t('profile.loadFailed') }))
      .finally(() => setLoading(false));
  }, []);

  const change = (patch: Partial<Profile>) => setProfile((p) => (p ? { ...p, ...patch } : p));

  const save = async () => {
    if (!profile || !profileRepository) return;
    setBusy(true);
    setMessage(null);
    try {
      setProfile(await profileRepository.update(profile));
      setMessage({ kind: 'ok', text: t('profile.updated') });
    } catch (e) {
      setMessage({ kind: 'error', text: e instanceof Error ? e.message : t('profile.saveFailed') });
    } finally {
      setBusy(false);
    }
  };

  return { profile, loading, busy, message, change, save, signOut };
}
