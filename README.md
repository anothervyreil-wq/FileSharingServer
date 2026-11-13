# Remix Developer App — hosted server

Node.js 20+ / Express server for the Windows sync client.

## Render configuration
- `ADMIN_USERNAME`: initial administrator username. On a fresh install, pair with `ADMIN_PASSWORD`.
- `ADMIN_PASSWORD`: initial administrator password (minimum 10 characters).
- `ADMIN_USERS`: comma-separated list of additional administrator usernames. Add/remove names here to grant/revoke administrator privileges. This is the ONLY way to grant admin privileges after bootstrap; the Windows app cannot promote accounts.
- `STORAGE_DIR`: persistent disk mount (recommended `/var/data`). If omitted, the server uses the bundled `storage` directory, which may be ephemeral on Render.
- `TOKEN_SECRET`: optional random secret retained for compatibility.
- `PORT`: supplied by Render; `MAX_FILE_MB`: upload limit (default 250).

Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` before first deployment. To add an admin later, create a normal account in the app, then add its exact username to `ADMIN_USERS` in Render and redeploy. Remove it from `ADMIN_USERS` to revoke admin privileges. Do not use plain HTTP.

## Access model
- Every authenticated account can read, upload, replace, move, copy, rename, delete, and synchronize shared files/folders.
- Only server-designated admins can create, disable, or delete accounts, or view login/device audit records.
- The client never offers an admin promotion control. User creation always creates a normal account.
- Passwords are salted scrypt hashes.
- Sessions persist on the server until explicit logout or account disable/removal. The client stores its session token locally and resumes it at next launch.
- Disabling or deleting an account invalidates its sessions on the next request from every device.

## Storage and sync
Files are stored in `STORAGE_DIR/uploads`; metadata and sessions are in `STORAGE_DIR/metadata`. Mount a Render persistent disk at `/var/data` and set `STORAGE_DIR=/var/data` to retain data across restarts/deploys. Without it, the local fallback may be lost on redeploy/restart.
