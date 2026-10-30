# Backend prompt: send email to a range of users

Paste this to whoever (or whichever tool) works on the backend.

---

Update `POST /api/admin/emails` so an admin can email only part of a group, chosen by number range (for example users 1–100).

**Request** (everything that exists today stays the same; `range` is new and optional):

```json
{
  "roles": ["USER", "INVESTOR"],
  "subject": "…",
  "message": "…",
  "images": ["…"],
  "attachments": [{ "name": "…", "url": "…", "contentType": "…" }],
  "range": { "from": 1, "to": 100 }
}
```

**Behaviour**

1. Build the recipient list exactly as today: every user holding at least one of `roles`, each user once even if they hold several of the roles, and only users with a valid email address.
2. Sort that list by user `id` ascending (oldest user first). The sort must be stable and the same on every call, so "1–100" always means the same people.
3. If `range` is present, keep only the positions `from` to `to`, inclusive and 1-based. Example: `{ "from": 1, "to": 100 }` is the first 100 users, `{ "from": 101, "to": 200 }` is the next 100. If `to` is larger than the list, just stop at the end of the list.
4. If `range` is absent, email everyone, as before.
5. Do this slicing in the database (`ORDER BY id ASC` with `OFFSET from-1 LIMIT to-from+1`), not by loading all users into memory.
6. Keep sending asynchronously. Return `202 Accepted` with `{ "recipients": <number actually queued> }`. `recipients` must count only the users inside the range.

**Validation** (return `400` with the usual `{status, code, message, details?}` body):

- `from` and `to` must both be integers.
- `from` must be at least 1 and `to` must be at least `from`.
- Cap the size of one request at 1000 users (`to - from + 1 <= 1000`). Return a clear message if it is exceeded.
- If `from` is greater than the number of matching users, return `400` with code `RANGE_OUT_OF_BOUNDS` and a message such as "Only 40 users match, so 50–100 is empty".

**Also**

- Keep the endpoint restricted to ADMIN and SUPER_ADMIN, as today.
- Add tests for: no range (everyone), `1–100`, a middle range (`101–200`), `to` past the end, `from` past the end, an invalid range (`0–5`, `10–5`), and a user in two roles counted once.
- Update `docs/api-contract.md` for this endpoint.
