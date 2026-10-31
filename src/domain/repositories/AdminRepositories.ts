import type { Property } from '../property';
import type { Dashboard, Note, Profile } from '../note';

export interface AdminUser { username: string; name?: string }

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

export interface NotesRepository {
  list(): Promise<Note[]>;
  save(note: Note): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface ProfileRepository {
  get(): Promise<Profile>;
  update(profile: Profile): Promise<Profile>;
}

export interface DashboardRepository {
  get(): Promise<Dashboard>;
}
