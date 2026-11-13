# Remix Developer App — hosted server (v2.1)

Node.js 20+ / Express server for the Windows sync client.

## Required deployment settings
- `STORAGE_DIR`: writable storage directory. For Render Free without a paid disk, unset it or set `/tmp/remix-developer-app-storage`; this is temporary and data can be lost on restart/redeploy. For durable storage, use a persistent disk or external object storage.
- `ADMIN_USERNAME`: initial administrator username (created only when there are no users) and always treated as an administrator.
- `ADMIN_PASSWORD`: initial administrator password (minimum 10 characters).
- `ADMIN_USERS`: comma-separated additional administrator usernames; admin status is granted only by server environment variables. `TOKEN_SECRET`: optional long random secret. If omitted, a random secret is persisted under `STORAGE_DIR/metadata/token-secret`; keep storage persistent for stable sessions.
- `PORT`: platform supplied; `MAX_FILE_MB`: upload limit (default 250).

Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` before the first start. If users already exist, changing these variables does not reset accounts. Do not expose the service over plain HTTP; use HTTPS.

## Accounts and permissions
- Passwords are stored as salted scrypt hashes, never plaintext.
- Bearer tokens expire after 12 hours.
- Admin: manage accounts and all files.
- Editor: create, upload, replace, move, and delete shared files.
- Viewer: read-only access.
- Admin API: `GET/POST /api/admin/users`, `PATCH/DELETE /api/admin/users/:id`.
- Self-service password change: `POST /api/auth/password`.
- Login: `POST /api/auth/login`.

## Storage and sync API
The server stores uploaded file bytes in `STORAGE_DIR/uploads` and metadata in `STORAGE_DIR/metadata`. The desktop client reconciles the server manifest with a user-selected local Windows folder. Remote changes download into that folder; local changes are staged and published with **Send changes**. Deploy the matching client and server versions together.
