# FileSharing Render Server (No Token)

Node.js/Express server for the FileSharing Windows client. No access token or login secret is required.

## Deploy on Render
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

The server listens on `0.0.0.0` and Render's `PORT` environment variable.

## Optional environment variables
- `MAX_FILE_MB` (default `250`)
- `STORAGE_DIR` (default `./storage`)
- `UPDATE_VERSION` (default `1.1.0`)
- `UPDATE_CHANGES` (pipe-separated release notes)
- `UPDATE_DOWNLOAD_URL` (HTTPS link to the latest Windows EXE)

## Important security and storage notes
This no-token server is public: anyone who knows the URL can list, upload, and download files. Do not use it for private or sensitive files.

Render free web services use ephemeral storage and can lose uploaded files after restarts, deploys, or sleep. For persistent uploads, use a paid Render service with a persistent disk mounted at `/var/data`, then set `STORAGE_DIR=/var/data`. See https://render.com/docs/disks and https://render.com/docs/free.
