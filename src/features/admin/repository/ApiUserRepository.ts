import type { AppUser, BroadcastEmail, MailAttachment, NewUser, UserRole, UserPage, UserQuery, UserSubType } from '@/features/admin/model/user';
import type { UserRepository } from '@/features/admin/repository/AdminRepositories';
import { createAuthorizedFetch } from '@/core/network/authorizedFetch';
import { t } from '@/core/utils/i18n';

export const ATTACHMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
];
const IMAGE_MAX = 5 * 1024 * 1024;
const FILE_MAX = 10 * 1024 * 1024;

interface UserDto extends Omit<AppUser, 'subType' | 'notes'> {
  subType?: UserSubType | null;
  notes?: string | null;
}

/**
 * GET  {api}/users?page=&size=&role=&q=  -> { content: UserResponse[], totalElements, totalPages }
 * POST {api}/users  UserRequest          -> UserResponse
 * POST {api}/admin/emails { roles, subject, message, images?, attachments? } -> 202 { recipients, status }
 * POST {api}/images (images) / {api}/files (PDF, Word) multipart "file" -> { url }
 */
export class ApiUserRepository implements UserRepository {
  private readonly send: ReturnType<typeof createAuthorizedFetch>;

  constructor(apiRoot: string) {
    this.send = createAuthorizedFetch(apiRoot);
  }

  list = async ({ page, size, role, q }: UserQuery): Promise<UserPage> => {
    const qs = new URLSearchParams({ page: String(page - 1), size: String(size) });
    if (role !== 'All') qs.set('role', role);
    if (q.trim()) qs.set('q', q.trim());
    const body = (await (await this.send(`/users?${qs}`)).json()) as { content: UserDto[]; totalElements: number; totalPages: number };
    return {
      items: body.content.map(({ subType, notes, ...u }) => ({ ...u, subType: subType ?? undefined, notes: notes ?? undefined })),
      total: body.totalElements,
      totalPages: Math.max(1, body.totalPages),
    };
  };

  create = async (u: NewUser) => {
    await this.send('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: u.username.trim(),
        name: u.name.trim(),
        email: u.email.trim(),
        countryCode: u.countryCode.trim(),
        mobileNumber: u.mobileNumber.trim(),
        password: u.password || null,
        roles: [u.role],
        role: u.role,
        subType: u.subType ?? null,
        dealsCount: u.dealsCount,
        notes: u.notes.trim() || null,
      }),
    });
  };

  uploadAttachment = async (file: File): Promise<MailAttachment> => {
    const isImage = file.type.startsWith('image/');
    if (!ATTACHMENT_TYPES.includes(file.type)) throw new Error(t('email.errFileType', { name: file.name }));
    if (file.size > (isImage ? IMAGE_MAX : FILE_MAX)) throw new Error(t('email.errFileSize', { name: file.name, mb: isImage ? 5 : 10 }));
    const form = new FormData();
    form.append('file', file);
    const { url } = (await (await this.send(isImage ? '/images' : '/files', { method: 'POST', body: form })).json()) as { url?: string };
    if (!url) throw new Error(t('api.uploadNoUrl'));
    // Relative URLs are served by the backend, not by this site
    const abs = url.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''}${url}` : url;
    return { name: file.name, url: abs, contentType: file.type };
  };

  count = async (role: UserRole) => {
    const body = (await (await this.send(`/users?page=0&size=1&role=${role}`)).json()) as { totalElements: number };
    return body.totalElements;
  };

  /** Resolves with the recipient count the server reports (202 Accepted). */
  sendEmail = async (mail: BroadcastEmail) => {
    const res = await this.send('/admin/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roles: mail.roles,
        subject: mail.subject.trim(),
        message: mail.message.trim(),
        // only sent when used, so plain mails stay exactly as before
        ...(mail.images?.length && { images: mail.images }),
        ...(mail.attachments?.length && { attachments: mail.attachments }),
      }),
    });
    const body = (await res.json().catch(() => ({}))) as { recipients?: number };
    return body.recipients;
  };
}
