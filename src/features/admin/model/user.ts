export const USER_ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN', 'PROPERTY_OWNER', 'INVESTOR'] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const USER_SUB_TYPES = ['VIP', 'VVIP'] as const;
export type UserSubType = (typeof USER_SUB_TYPES)[number];

/** Only these roles sign in to the admin, so only they need a username and password. */
export const isStaffRole = (role: UserRole) => role === 'ADMIN' || role === 'SUPER_ADMIN';

export interface AppUser {
  id: number;
  username: string;
  name: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  role: UserRole;
  subType?: UserSubType;
  dealsCount: number;
  notes?: string;
  createdAt?: string;
}

/** Form values for adding a user. */
export interface NewUser {
  username: string;
  name: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  password: string;
  role: UserRole;
  subType?: UserSubType;
  dealsCount: number;
  notes: string;
}

export interface UserQuery {
  page: number;
  size: number;
  role: UserRole | 'All';
  /** Free-text search over name and mobile number. */
  q: string;
}

export interface UserPage {
  items: AppUser[];
  total: number;
  totalPages: number;
}

export interface MailAttachment {
  name: string;
  url: string;
  contentType: string;
}

/** Inclusive 1-based positions among the chosen recipients (oldest user first), e.g. 1–100. */
export interface RecipientRange {
  from: number;
  to: number;
}

/** Reads "1-100" (also "1 – 100", "1 to 100"). Null when it isn't a valid range. */
export const parseRecipientRange = (text: string): RecipientRange | null => {
  const m = text.trim().match(/^(\d+)\s*(?:-|–|—|to)\s*(\d+)$/i);
  if (!m) return null;
  const from = Number(m[1]);
  const to = Number(m[2]);
  return from >= 1 && to >= from ? { from, to } : null;
};

export interface BroadcastEmail {
  roles: UserRole[];
  subject: string;
  message: string;
  /** Email exactly these users instead of whole groups (`roles` and `range` are then ignored). */
  userIds?: number[];
  /** Only email these positions among the chosen roles. Everyone when omitted. */
  range?: RecipientRange;
  /** Image URLs shown in the body of the mail. */
  images?: string[];
  /** Files (PDF, Word, images) attached to the mail. */
  attachments?: MailAttachment[];
}
