'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const BUNDLED_DOCS = path.join(__dirname, '..', 'docs');
const STORAGE_ROOT = process.env.STORAGE_ROOT || BUNDLED_DOCS;

const app = express();
app.use(express.json({ limit: '12mb' }));

function auth(req, res, next) {
  if (!ADMIN_TOKEN) {
    return res.status(503).json({ error: 'ADMIN_TOKEN no configurado en el servidor' });
  }
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  next();
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function resolveStorage(rel) {
  return path.join(STORAGE_ROOT, rel);
}

function resolveRead(rel) {
  const storagePath = resolveStorage(rel);
  if (fs.existsSync(storagePath)) return storagePath;
  return path.join(BUNDLED_DOCS, rel);
}

function writeFile(rel, content, encoding) {
  const target = resolveStorage(rel);
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, content, encoding);
  return target;
}

function seedStorageIfEmpty() {
  if (STORAGE_ROOT === BUNDLED_DOCS) return;
  const marker = resolveStorage('.seeded');
  if (fs.existsSync(marker)) return;
  ensureDir(STORAGE_ROOT);
  fs.cpSync(BUNDLED_DOCS, STORAGE_ROOT, { recursive: true });
  fs.writeFileSync(marker, new Date().toISOString(), 'utf8');
  console.log('Storage inicializado desde docs/ →', STORAGE_ROOT);
}

seedStorageIfEmpty();

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'uwu',
    storage: STORAGE_ROOT,
    hasAdminToken: !!ADMIN_TOKEN,
    at: new Date().toISOString(),
  });
});

app.get('/api/admin/test', auth, (_req, res) => {
  res.json({ ok: true, message: 'Conexión con Railway OK' });
});

app.put('/api/sync/template/:slug', auth, (req, res) => {
  const slug = String(req.params.slug || '').replace(/[^a-z0-9-]/gi, '');
  const html = req.body && req.body.content;
  if (!slug || typeof html !== 'string') {
    return res.status(400).json({ error: 'slug y content (HTML) son obligatorios' });
  }
  writeFile(path.join('d', slug + '.html'), html, 'utf8');
  res.json({ ok: true, slug, path: 'd/' + slug + '.html' });
});

app.put('/api/sync/audio/:slug', auth, (req, res) => {
  const slug = String(req.params.slug || '').replace(/[^a-z0-9-]/gi, '');
  const base64 = req.body && req.body.content;
  if (!slug || typeof base64 !== 'string') {
    return res.status(400).json({ error: 'slug y content (base64) son obligatorios' });
  }
  writeFile(path.join('d', 'audio', slug + '.mp3'), Buffer.from(base64, 'base64'));
  res.json({ ok: true, slug, path: 'd/audio/' + slug + '.mp3' });
});

app.delete('/api/sync/audio/:slug', auth, (req, res) => {
  const slug = String(req.params.slug || '').replace(/[^a-z0-9-]/gi, '');
  const target = resolveStorage(path.join('d', 'audio', slug + '.mp3'));
  if (fs.existsSync(target)) fs.unlinkSync(target);
  res.json({ ok: true, slug, removed: true });
});

app.put('/api/sync/catalog', auth, (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'JSON de catálogo inválido' });
  }
  writeFile(path.join('data', 'catalog.json'), JSON.stringify(payload, null, 2), 'utf8');
  res.json({ ok: true, path: 'data/catalog.json', updatedAt: payload.updatedAt || null });
});

app.use((req, res, next) => {
  const rel = decodeURIComponent(req.path.replace(/^\//, ''));
  if (!rel || rel.endsWith('/')) {
    const indexPath = resolveRead(path.join(rel, 'index.html'));
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  }
  const filePath = resolveRead(rel);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  next();
});

app.use(express.static(STORAGE_ROOT, { extensions: ['html'] }));
app.use(express.static(BUNDLED_DOCS, { extensions: ['html'] }));

app.get('*', (req, res) => {
  const index = resolveRead('index.html');
  if (fs.existsSync(index)) return res.sendFile(index);
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log(`UWU server → http://0.0.0.0:${PORT}`);
  console.log(`Storage: ${STORAGE_ROOT}`);
});
