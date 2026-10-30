# Backend prompt: send email to specific users

Paste this to whoever (or whichever tool) works on the backend.

---

Update `POST /api/admin/emails` so an admin can email exactly the users they picked, not only whole groups.

**Request.** Everything that exists today stays the same. Add an optional `userIds`:

```json
{
  "userIds": [12, 15, 98],
  "subject": "…",
  "message": "…",
  "images": ["…"],
  "attachments": [{ "name": "…", "url": "…", "contentType": "…" }]
}
```

A request now targets recipients in exactly one of two ways:

- **By group** (today's behaviour): `roles` (and optionally `range`). The client does not send `userIds`.
- **By person** (new): `userIds`. The client does not send `roles` or `range`.

**Behaviour**

1. If `userIds` is present, load those users in one query (`WHERE id IN (...)`). Ignore `roles` and `range` if they are sent as well.
2. Remove duplicate ids, so nobody is emailed twice.
3. Skip, and do not fail on, users that don't exist or have no valid email address. Count only the users actually queued.
4. Keep sending asynchronously. Return `202 Accepted` with `{ "recipients": <number queued> }`. Add `"skipped": <number of ids not emailed>` too; the client ignores it for now.
5. Use the same subject, message, images and attachments handling as the group send. Do not reveal other recipients: send one mail per user, or use BCC.

**Validation** (return `400` with the usual `{status, code, message, details?}` body):

- If neither `roles` nor `userIds` is given (or both are empty), return a clear message.
- `userIds` must be an array of positive integers, with at most 1000 entries per request.
- If none of the ids can be emailed (all unknown, or none with an email), return `400` with code `NO_RECIPIENTS`.

**Also**

- Keep the endpoint restricted to ADMIN and SUPER_ADMIN, as today.
- Add tests for: a few valid ids, duplicate ids, an unknown id mixed with valid ones, all ids unknown, a user without an email, more than 1000 ids, an empty `userIds` with no `roles`, and `userIds` sent together with `roles` (only `userIds` is used).
- Update `docs/api-contract.md` for this endpoint.
