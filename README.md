# FileSharing Server (Render / Node.js)

This server matches the current FileSharing Windows client API:
- `GET /health`
- `GET /api/files?q=...` (Bearer token)
- `POST /api/upload` with multipart field name `files` (Bearer token)
- `GET /files/:filename` (Bearer token)
- `GET /api/updates/latest` (Bearer token)

## Important storage warning
Render's Free web services use an ephemeral filesystem. Uploaded files can disappear when the service sleeps, restarts, or redeploys. For files you need to keep, use a paid Render web service with a persistent disk mounted at `/var/data`, and set `STORAGE_DIR=/var/data`. Do not use the free plan for important file storage. Free services also sleep after 15 minutes without traffic and can take about a minute to wake up.

## Deploy to Render using GitHub
1. Extract this ZIP on your Windows PC.
2. Go to https://github.com and sign in (create a free account if needed).
3. Click **New repository**. Name it `filesharing-server`. Choose **Private**, then click **Create repository**.
4. On the new repository page, choose **uploading an existing file**. Drag in the contents of this folder (the files inside it, not the outer folder). Include `server.js`, `package.json`, `render.yaml`, `.gitignore`, and `README.md`. Commit the upload.
5. Go to https://dashboard.render.com and sign in with GitHub. Authorize Render to access the repository.
6. In Render, click **New** → **Web Service**. Select `filesharing-server` and click **Connect**.
7. Set Runtime to **Node**. Set Build Command to `npm install`; Start Command to `npm start`. If Render detects the `render.yaml`, it may offer the Blueprint configuration instead; accept the service configuration and verify the settings.
8. For a free test deployment, choose **Free**. Under **Environment Variables**, add `ACCESS_TOKEN` with a long random secret value. Add `MAX_FILE_MB` with value `250`. Click **Create Web Service**.
9. Wait for the deploy to finish and show **Live**. Copy the service URL, for example `https://your-service-name.onrender.com`.
10. Open `https://your-service-name.onrender.com/health` in a browser. You should see JSON containing `"status":"ok"`.
11. In the Windows FileSharing app, paste that URL into **Server address**, paste the exact `ACCESS_TOKEN` value into **Access token**, and click **Connect**.

## Keep uploaded files
For real use, do not leave the service on Free if you need uploaded files to persist. Upgrade the web service to a paid instance, open its **Disks** page, add a disk mounted at `/var/data`, then add environment variable `STORAGE_DIR=/var/data` and redeploy. Render persistent disks are available on paid services. Keep a backup of important files.

## Security
- Set a strong, private `ACCESS_TOKEN`; do not share it publicly.
- Anyone with this shared token can list, upload, and download all files.
- Use HTTPS Render URL, not plain HTTP.
- Do not commit your token to GitHub. Set it only in Render Environment Variables and the client app.
- The copied download link requires the same Bearer token; it is intended for use by authenticated clients, not unauthenticated browser sharing.
