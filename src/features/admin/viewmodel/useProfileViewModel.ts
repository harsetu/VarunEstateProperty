import { useEffect, useState } from 'react';
import type { Profile } from '@/features/admin/model/admin';
import { profileRepository } from '@/app/container';
import { useAdminAuth } from '@/features/admin/viewmodel/AdminAuthProvider';
import { adminSession } from '@/core/network/session';
import { t } from '@/core/utils/i18n';

const validate = (p: Profile) => {
  if (p.username.trim().length < 3 || p.username.trim().length > 50) return t('profile.errUsername');
  if (!p.name.trim()) return t('profile.errName');
  if (!/^\S+@\S+\.\S+$/.test(p.email.trim())) return t('profile.errEmail');
  if (!/^\+?[0-9]{1,4}$/.test(p.countryCode.trim())) return t('profile.errCountryCode');
  if (!/^[0-9]{6,15}$/.test(p.mobileNumber.trim())) return t('profile.errMobile');
  return null;
};

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
    const problem = validate(profile);
    if (problem) return setMessage({ kind: 'error', text: problem });
    setBusy(true);
    setMessage(null);
    try {
      const saved = await profileRepository.update({
        ...profile,
        username: profile.username.trim(), name: profile.name.trim(), email: profile.email.trim(),
        countryCode: profile.countryCode.trim(), mobileNumber: profile.mobileNumber.trim(),
      });
      setProfile(saved);
      // keep the name shown in the admin header in step
      const session = adminSession.get();
      if (session) adminSession.set({ ...session, user: { ...session.user, username: saved.username, name: saved.name } });
      setMessage({ kind: 'ok', text: t('profile.updated') });
    } catch (e) {
      setMessage({ kind: 'error', text: e instanceof Error ? e.message : t('profile.saveFailed') });
    } finally {
      setBusy(false);
    }
  };

  const [pwBusy, setPwBusy] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  /** Resolves true on success so the form can clear itself. */
  const changePassword = async (current: string, next: string, confirm: string) => {
    if (!profileRepository) return false;
    if (next.length < 8) return setPwMessage({ kind: 'error', text: t('profile.errPwShort') }), false;
    if (next !== confirm) return setPwMessage({ kind: 'error', text: t('profile.errPwMatch') }), false;
    setPwBusy(true);
    setPwMessage(null);
    try {
      await profileRepository.changePassword(current, next);
      setPwMessage({ kind: 'ok', text: t('profile.pwChanged') });
      return true;
    } catch (e) {
      setPwMessage({ kind: 'error', text: e instanceof Error ? e.message : t('profile.pwFailed') });
      return false;
    } finally {
      setPwBusy(false);
    }
  };

  return { profile, loading, busy, message, change, save, signOut, pwBusy, pwMessage, changePassword };
}
