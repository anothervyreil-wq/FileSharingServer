'use strict';
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT || 8765);
const TOKEN = process.env.ACCESS_TOKEN || 'CHANGE_THIS_TOKEN_BEFORE_DEPLOYING';
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(__dirname, 'storage');
const MAX_FILE_MB = Math.max(1, Number(process.env.MAX_FILE_MB || 250));
const META_DIR = path.join(STORAGE_DIR, 'metadata');
const FILE_DIR = path.join(STORAGE_DIR, 'uploads');
fs.mkdirSync(META_DIR, { recursive: true });
fs.mkdirSync(FILE_DIR, { recursive: true });

function auth(req, res, next) {
  const header = req.get('authorization') || '';
  const supplied = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const a = Buffer.from(supplied);
  const b = Buffer.from(TOKEN);
  if (TOKEN === 'CHANGE_THIS_TOKEN_BEFORE_DEPLOYING' || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Unauthorized. Check your access token.' });
  }
  next();
}
function readFiles() {
  return fs.readdirSync(META_DIR).filter(x => x.endsWith('.json')).map(name => {
    try { return JSON.parse(fs.readFileSync(path.join(META_DIR, name), 'utf8')); } catch { return null; }
  }).filter(Boolean).sort((a,b) => b.uploaded.localeCompare(a.uploaded));
}
function safeName(name) {
  const base = path.basename(String(name || 'file')).replace(/[\x00-\x1f<>:"/\\|?*]/g, '_').trim();
  return base.slice(0, 180) || 'file';
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, FILE_DIR),
  filename: (_req, file, cb) => cb(null, crypto.randomUUID() + path.extname(safeName(file.originalname)).slice(0, 20))
});
const upload = multer({ storage, limits: { fileSize: MAX_FILE_MB * 1024 * 1024, files: 30 } });

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'FileSharing', version: '1.0.0' }));
app.get('/api/files', auth, (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const files = readFiles().filter(f => f.name.toLowerCase().includes(q));
  res.json({ files, count: files.length });
});
app.post('/api/upload', auth, (req, res) => {
  upload.array('files', 30)(req, res, err => {
    if (err) {
      const status = err instanceof multer.MulterError ? 413 : 400;
      return res.status(status).json({ error: err.message || 'Upload failed' });
    }
    const saved = (req.files || []).map(file => {
      const item = {
        id: path.basename(file.filename, path.extname(file.filename)),
        name: safeName(file.originalname),
        size: file.size,
        uploaded: new Date().toISOString(),
        download_url: '/files/' + encodeURIComponent(file.filename)
      };
      fs.writeFileSync(path.join(META_DIR, item.id + '.json'), JSON.stringify(item, null, 2));
      return item;
    });
    res.json({ uploaded: saved.length, files: saved });
  });
});
app.get('/files/:filename', auth, (req, res) => {
  const filename = path.basename(req.params.filename);
  const full = path.join(FILE_DIR, filename);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) return res.status(404).json({ error: 'File not found' });
  const meta = readFiles().find(f => f.download_url === '/files/' + encodeURIComponent(filename));
  res.download(full, meta ? meta.name : filename);
});
app.get('/api/updates/latest', auth, (_req, res) => {
  res.json({
    version: process.env.UPDATE_VERSION || '1.0.0',
    changes: (process.env.UPDATE_CHANGES || 'Initial server release').split('|').filter(Boolean),
    download_url: process.env.UPDATE_DOWNLOAD_URL || null
  });
});
app.get('/', (_req, res) => res.type('text').send('FileSharing server is running.'));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
app.listen(PORT, '0.0.0.0', () => console.log(`FileSharing server listening on ${PORT}; storage=${STORAGE_DIR}`));
