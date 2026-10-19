# Backend API contract

`VITE_API_BASE_URL` is the server origin (e.g. `http://localhost:8080`); all paths below are under `/api`.
CORS must allow the site's origin. Setting it enables the admin login at `/admin`.

## Admin login (implemented by the backend)
`POST /api/auth/login` `{ "identifier": "<username or mobile>", "password": "..." }`
→ `{ accessToken, refreshToken, tokenType, expiresInSeconds, user: { id, username, name, role } }`
Errors: `{ status, code, message }` (e.g. 404 `USER_NOT_FOUND`); the message is shown on the login form.
`POST /api/auth/refresh` `{ "refreshToken" }` → new `TokenResponse`. Used automatically after a 401.

## Listings (still to be built on the backend)
Public: `GET /api/properties`, `GET /api/properties/:id`, `GET /api/properties/:id/nearby`, `GET /api/projects`.
Set `VITE_LISTINGS_FROM_API=true` to read listings from these.

Admin (`Authorization: Bearer <accessToken>`; the server must verify the role on every request):
| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/properties` | `Property` | 201 |
| PUT | `/api/properties/:id` | `Property` | 200 |
| DELETE | `/api/properties/:id` | — | 204 |
| POST | `/api/images` | multipart field `file` (JPEG/PNG/WebP/GIF, ≤ 5 MB) | 201 `{ key, url, contentType, sizeBytes }` |

## Property
See `src/features/properties/model/property.ts`: `id, title, type, purpose, sector, price, priceValue, area, bedrooms?, bathrooms?,
description, images[], amenities[], featured, mapEmbed, floorPlans?, videoUrl?, nearby?`.

## Contact form

`POST /api/contact` (public, no token) — `{ "name", "phoneNumber", "emailId", "message" }`.
Any 2xx counts as sent; otherwise the response's `message` is shown under the form.

## Users (admin)

- `GET /api/users?page=&size=&role=&q=` — paged `UserResponse` (`q` searches name and mobile number).
- `POST /api/users` — `UserRequest` `{ username, name, email, countryCode, mobileNumber, password, roles, role, subType, dealsCount, notes }`.

## Email users (admin)

`POST /api/admin/emails` — `{ "roles": ["USER", "INVESTOR"], "subject": "…", "message": "…" }`.
The server emails every user holding one of the roles and returns 2xx once the mail is queued.
The compose dialog shows recipient counts using `GET /api/users?role=X&size=1` (`totalElements`).

Optional mail extras (sent only when used): `images` — array of image URLs shown in the body;
`attachments` — array of `{ name, url, contentType }`. Files are uploaded first: images to `POST /api/images`,
PDF/Word to `POST /api/files` (multipart `file`, response `{ url }`).
