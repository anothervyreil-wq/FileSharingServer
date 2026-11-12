# Remix Developer App — hosted server

Node.js/Express API for the Remix Developer App Windows client.

## Deploy
- Runtime: Node.js 20+ (Node.js 22 recommended)
- Start command: `npm start`
- Persistent disk: mount it at the configured `STORAGE_DIR` (or preserve the default `storage` directory).
- Environment: `PORT` (platform supplied), `STORAGE_DIR` (recommended persistent mount), `MAX_FILE_MB` (default 250), `UPDATE_VERSION`, `UPDATE_CHANGES` (pipe-separated), `UPDATE_DOWNLOAD_URL`.

The server stores binary file contents under `STORAGE_DIR/uploads` and JSON metadata/activity under `STORAGE_DIR/metadata`. Ensure the platform's persistent disk is mounted at `STORAGE_DIR`; ephemeral container storage will not survive redeploys.

## API capabilities
- List folders/files and retrieve activity.
- Create folders and upload/download actual file bytes.
- Rename and move files/folders (`PUT /api/items/:type/:id`).
- Copy files/folders (`POST /api/items/:type/:id/copy`).
- Delete files/folders (`DELETE /api/items/:type/:id`).
- Replace file contents (`POST /api/files/:id/replace`, multipart field `file`).
- Persist manual ordering (`PATCH /api/storage/order`).

Names and folder paths are validated; metadata writes use a temporary file and atomic rename. This server does not implement authentication or per-user authorization. Do not expose it publicly with sensitive data until authentication and transport/access controls are added.
