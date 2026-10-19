import type { Property } from '@/features/properties/model/property';
import type { Dashboard, Profile } from '@/features/admin/model/admin';

export type { AdminUser } from '@/core/network/session';
import type { AdminUser } from '@/core/network/session';
import type { BroadcastEmail, MailAttachment, NewUser, UserPage, UserQuery, UserRole } from '@/features/admin/model/user';

export interface AuthService {
  getUser(): Promise<AdminUser | null>;
  /** `identifier` is a username or mobile number. Rejects with a readable message on failure. */
  signIn(identifier: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  /** Returns an unsubscribe function. */
  onChange(listener: (user: AdminUser | null) => void): () => void;
}

/** Write side of the catalog, available only to a signed-in admin. */
export interface ListingAdminRepository {
  createProperty(property: Property): Promise<void>;
  updateProperty(property: Property): Promise<void>;
  deleteProperty(id: string): Promise<void>;
  uploadImage(file: File): Promise<string>;
}

export interface UserRepository {
  list(query: UserQuery): Promise<UserPage>;
  create(user: NewUser): Promise<void>;
  /** Number of users with the role (used to show how many people a mail will reach). */
  count(role: UserRole): Promise<number>;
  /** Asks the server to email every user holding one of the roles. */
  /** Uploads a mail image or attachment and returns where it is stored. */
  uploadAttachment(file: File): Promise<MailAttachment>;
  sendEmail(mail: BroadcastEmail): Promise<number | undefined>;

}

export interface ProfileRepository {
  get(): Promise<Profile>;
  update(profile: Profile): Promise<Profile>;
}

export interface DashboardRepository {
  get(): Promise<Dashboard>;
}
