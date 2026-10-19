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

export interface BroadcastEmail {
  roles: UserRole[];
  subject: string;
  message: string;
  /** Image URLs shown in the body of the mail. */
  images?: string[];
  /** Files (PDF, Word, images) attached to the mail. */
  attachments?: MailAttachment[];
}
