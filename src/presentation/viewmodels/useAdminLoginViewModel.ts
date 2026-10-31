import { useState, type FormEvent } from 'react';
import { useAdminAuth } from '@/presentation/admin/AdminAuthProvider';
import { t } from '@/i18n';

export function useAdminLoginViewModel() {
  const { available, loading, user, signIn } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.failed'));
    } finally {
      setBusy(false);
    }
  };

  return { available, loading, signedIn: Boolean(user), username, setUsername, password, setPassword, busy, error, submit };
}
