# FileSharing server 1.2.0 (Render)

Deploy this folder as a Node web service. Build command: `npm install`; start command: `npm start`.

Set a persistent disk and mount it at `/var/data`; set `STORAGE_DIR=/var/data` in Render so uploaded files, folders, ordering, and activity survive deploys/restarts. Without a persistent disk, Render filesystem changes can be lost on redeploy/restart.

## API
- `GET /health`
- `GET /api/storage?folder=` — list files/folders in a folder
- `POST /api/folders` JSON `{ "name": "Folder", "parent": "" }`
- `POST /api/upload` multipart fields `files` and `folder`
- `PATCH /api/storage/order` JSON `{ "folder": "", "items": [{"id":"...","type":"file|folder"}] }`
- `GET /api/activity`
- `GET /files/:filename`
- `GET /api/updates/latest`

The Windows client and server must be updated together for Storage browsing, folder activity, and saved ordering. The server currently has no user authentication; anyone who can reach its public URL can access and modify shared storage. Do not store sensitive/private files on a public unauthenticated deployment.
