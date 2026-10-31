import flavor from '@/flavors';
import type { PropertyRepository } from '@/features/properties/repository/PropertyRepository';
import type { AuthService, ListingAdminRepository, DashboardRepository, UserRepository, ProfileRepository, ThemeRepository } from '@/features/admin/repository/AdminRepositories';
import { StaticPropertyRepository } from '@/features/properties/repository/StaticPropertyRepository';
import { ApiPropertyRepository } from '@/features/properties/repository/ApiPropertyRepository';
import { FlavorHomeRepository } from '@/features/home/data/FlavorHomeRepository';
import type { HomeRepository } from '@/features/home/repository/HomeRepository';
import { ApiAuthService } from '@/features/admin/repository/ApiAuthService';
import { ApiListingAdmin } from '@/features/admin/repository/ApiListingAdmin';
import { ApiDashboardRepository } from '@/features/admin/repository/ApiDashboardRepository';
import { ApiProfileRepository } from '@/features/admin/repository/ApiProfileRepository';
import type { ContactRepository } from '@/features/contact/repository/ContactRepository';
import { ApiContactRepository } from '@/features/contact/repository/ApiContactRepository';
import type { LocationSearchRepository } from '@/features/admin/repository/LocationSearchRepository';
import { NominatimLocationSearch } from '@/features/admin/repository/NominatimLocationSearch';
import type { ReviewRepository } from '@/features/reviews/repository/ReviewRepository';
import { ApiReviewRepository } from '@/features/reviews/repository/ApiReviewRepository';
import { ApiThemeRepository } from '@/features/admin/repository/ApiThemeRepository';
import { ApiUserRepository } from '@/features/admin/repository/ApiUserRepository';

// Composition root: the only place that knows which implementations back the app.
// VITE_API_BASE_URL (server origin, e.g. http://localhost:8080) turns on admin login; the API lives under /api.
const origin = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
// Dev server proxies /api to the backend (see vite.config.ts); production calls the server directly (needs CORS).
const apiRoot = origin ? `${import.meta.env.DEV ? '' : origin}/api` : '';

// Public listings come from the API for `api` flavors, or when VITE_LISTINGS_FROM_API=true
// (leave it off until the backend serves /api/properties — the built-in listings are used meanwhile).
const source = flavor.source;
export const propertyRepository: PropertyRepository =
  source.kind === 'api'
    ? new ApiPropertyRepository(source.baseUrl, source.headers)
    : apiRoot && import.meta.env.VITE_LISTINGS_FROM_API === 'true'
      ? new ApiPropertyRepository(apiRoot)
      : new StaticPropertyRepository(source);

/** null until an API is configured. */
export const authService: AuthService | null = apiRoot ? new ApiAuthService(apiRoot) : null;
export const listingAdmin: ListingAdminRepository | null = apiRoot ? new ApiListingAdmin(apiRoot) : null;
export const profileRepository: ProfileRepository | null = apiRoot ? new ApiProfileRepository(apiRoot) : null;
/** null until an API is configured; the site then keeps the default theme. */
export const themeRepository: ThemeRepository | null = apiRoot ? new ApiThemeRepository(apiRoot) : null;
export const userRepository: UserRepository | null = apiRoot ? new ApiUserRepository(apiRoot) : null;
/** null until an API is configured; the website then hides its reviews section. */
export const reviewRepository: ReviewRepository | null = apiRoot ? new ApiReviewRepository(apiRoot) : null;
export const dashboardRepository: DashboardRepository | null = apiRoot ? new ApiDashboardRepository(apiRoot) : null;
export const homeRepository: HomeRepository = new FlavorHomeRepository(flavor);
/** null until an API is configured; the contact form then only confirms on screen. */
export const contactRepository: ContactRepository | null = apiRoot ? new ApiContactRepository(apiRoot) : null;
/** Address lookup used to fill a listing's coordinates. */
export const locationSearch: LocationSearchRepository = new NominatimLocationSearch(flavor.geo);
