import { useCallback, useEffect, useState } from 'react';
import { userRepository } from '@/app/container';
import { USER_ROLES, isStaffRole, type AppUser, type NewUser, type UserRole } from '@/features/admin/model/user';
import { t } from '@/core/utils/i18n';

export const USERS_PAGE_SIZE = 20;
const SEARCH_DELAY_MS = 350;

const BLANK: NewUser = {
  username: '', name: '', email: '', countryCode: '+91', mobileNumber: '', password: '',
  role: 'USER', subType: undefined, dealsCount: 0, notes: '',
};

const validate = (u: NewUser) => {
  const staff = isStaffRole(u.role);
  if (staff && (u.username.trim().length < 3 || u.username.trim().length > 50)) return t('users.errUsername');
  if (!u.name.trim()) return t('users.errName');
  if (!/^\S+@\S+\.\S+$/.test(u.email.trim())) return t('users.errEmail');
  if (!/^\+?[0-9]{1,4}$/.test(u.countryCode.trim())) return t('users.errCountryCode');
  if (!/^[0-9]{6,15}$/.test(u.mobileNumber.trim())) return t('users.errMobile');
  if (staff && u.password.length < 8) return t('users.errPassword');
  if (!staff && !(u.dealsCount >= 0)) return t('users.errDeals');
  return null;
};

/** Paged, searchable list of users plus the add-user form. Every filter/page change runs a new query. */
export function useAdminUsersViewModel() {
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [role, setRole] = useState<UserRole | 'All'>('All');
  const [page, setPage] = useState(1);
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error'; error?: string; items: AppUser[]; total: number; totalPages: number }>({
    status: 'loading', items: [], total: 0, totalPages: 1,
  });
  const [attempt, setAttempt] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  // Wait for a pause in typing before searching
  useEffect(() => {
    const id = setTimeout(() => { setQ(search); setPage(1); }, SEARCH_DELAY_MS);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    if (!userRepository) return;
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading', error: undefined }));
    userRepository.list({ page, size: USERS_PAGE_SIZE, role, q })
      .then((r) => !cancelled && setState({ status: 'ready', items: r.items, total: r.total, totalPages: r.totalPages }))
      .catch((e: unknown) => !cancelled && setState((s) => ({ ...s, status: 'error', error: e instanceof Error ? e.message : t('error.generic') })));
    return () => { cancelled = true; };
  }, [page, role, q, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  const pickRole = (r: UserRole | 'All') => { setRole(r); setPage(1); };

  // ---- add user ----
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<NewUser>(BLANK);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openAdd = () => { setDraft(BLANK); setFormError(null); setAdding(true); };
  const closeAdd = () => setAdding(false);
  const change = (patch: Partial<NewUser>) => setDraft((d) => ({ ...d, ...patch }));

  const submit = async () => {
    if (!userRepository) return;
    const problem = validate(draft);
    if (problem) return setFormError(problem);
    setSaving(true);
    setFormError(null);
    try {
      // Customers don't sign in: no password, and the mobile number doubles as the (required) username
      const staff = isStaffRole(draft.role);
      await userRepository.create(
        staff
          ? { ...draft, subType: undefined, dealsCount: 0 }
          : { ...draft, username: draft.mobileNumber.trim(), password: '' },
      );
      setAdding(false);
      setNotice(t('users.added'));
      setPage(1);
      reload();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : t('error.generic'));
    } finally {
      setSaving(false);
    }
  };

  return {
    ...state, notice, reload,
    search, setSearch, role, pickRole, roles: USER_ROLES, page, setPage, pageSize: USERS_PAGE_SIZE,
    adding, draft, saving, formError, openAdd, closeAdd, change, submit,
  };
}
