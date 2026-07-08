'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const tplAudio = require('./template-audio');

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const BUNDLED_DOCS = path.join(__dirname, '..', 'docs');
const STORAGE_ROOT = process.env.STORAGE_ROOT || BUNDLED_DOCS;
const SESSION_COOKIE = 'uwu_admin';
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

// Brute-force protection: max 10 login attempts per IP per 15 minutes
const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;

function checkLoginRateLimit(ip) {
  const now = Date.now();
  let entry = loginAttempts.get(ip);
  if (!entry || now - entry.start > LOGIN_WINDOW_MS) {
    entry = { count: 0, start: now };
  }
  entry.count++;
  loginAttempts.set(ip, entry);
  return entry.count <= LOGIN_MAX_ATTEMPTS;
}

function resetLoginRateLimit(ip) {
  loginAttempts.delete(ip);
}

// Purge stale rate-limit entries every 30 minutes
setInterval(function () {
  const cutoff = Date.now() - LOGIN_WINDOW_MS;
  for (const [ip, entry] of loginAttempts) {
    if (entry.start < cutoff) loginAttempts.delete(ip);
  }
}, 30 * 60 * 1000);

const app = express();
app.use(express.json({ limit: '12mb' }));
app.set('trust proxy', 1);

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return header.split(';').reduce(function (acc, part) {
    const i = part.indexOf('=');
    if (i === -1) return acc;
    const key = part.slice(0, i).trim();
    const val = decodeURIComponent(part.slice(i + 1).trim());
    acc[key] = val;
    return acc;
  }, {});
}

function createSessionToken() {
  const payload = String(Date.now());
  const sig = crypto.createHmac('sha256', ADMIN_TOKEN).update(payload).digest('hex');
  return payload + '.' + sig;
}

function verifySessionToken(token) {
  if (!token || !ADMIN_TOKEN) return false;
  const parts = String(token).split('.');
  if (parts.length !== 2) return false;
  const expected = crypto.createHmac('sha256', ADMIN_TOKEN).update(parts[0]).digest('hex');
  if (expected !== parts[1]) return false;
  const age = Date.now() - Number(parts[0]);
  return age >= 0 && age < SESSION_MAX_AGE_MS;
}

function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production';
  const bits = [
    SESSION_COOKIE + '=' + encodeURIComponent(token),
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=' + Math.floor(SESSION_MAX_AGE_MS / 1000),
  ];
  if (secure) bits.push('Secure');
  res.setHeader('Set-Cookie', bits.join('; '));
}

function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production';
  const bits = [
    SESSION_COOKIE + '=',
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=0',
  ];
  if (secure) bits.push('Secure');
  res.setHeader('Set-Cookie', bits.join('; '));
}

function isAuthed(req) {
  if (!ADMIN_TOKEN) return false;
  const header = req.headers.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (bearer && bearer === ADMIN_TOKEN) return true;
  const cookies = parseCookies(req);
  return verifySessionToken(cookies[SESSION_COOKIE]);
}

function auth(req, res, next) {
  if (!ADMIN_TOKEN) {
    return res.status(503).json({ error: 'ADMIN_TOKEN no configurado en el servidor' });
  }
  if (!isAuthed(req)) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function isSafePath(base, resolved) {
  const rel = path.relative(base, resolved);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function resolveStorage(rel) {
  const resolved = path.resolve(STORAGE_ROOT, rel);
  if (!isSafePath(STORAGE_ROOT, resolved)) throw new Error('Ruta no permitida');
  return resolved;
}

function resolveRead(rel) {
  const storagePath = path.resolve(STORAGE_ROOT, rel);
  if (isSafePath(STORAGE_ROOT, storagePath) && fs.existsSync(storagePath)) return storagePath;
  const bundledPath = path.resolve(BUNDLED_DOCS, rel);
  if (!isSafePath(BUNDLED_DOCS, bundledPath)) throw new Error('Ruta no permitida');
  return bundledPath;
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
    hasAdminToken: !!ADMIN_TOKEN,
    hasAdminPassword: !!ADMIN_PASSWORD,
    at: new Date().toISOString(),
  });
});

app.get('/api/admin/session', (req, res) => {
  res.json({
    ok: isAuthed(req),
    user: isAuthed(req) ? ADMIN_USER : null,
    loginEnabled: !!(ADMIN_TOKEN && ADMIN_PASSWORD),
  });
});

app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_TOKEN || !ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Login admin no configurado en el servidor' });
  }
  const ip = req.ip || 'unknown';
  if (!checkLoginRateLimit(ip)) {
    return res.status(429).json({ error: 'Demasiados intentos. Intenta en 15 minutos.' });
  }
  const user = String((req.body && req.body.user) || '').trim();
  const password = String((req.body && req.body.password) || '');
  if (user !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }
  resetLoginRateLimit(ip);
  const token = createSessionToken();
  setSessionCookie(res, token);
  res.json({ ok: true, user: ADMIN_USER });
});

app.post('/api/admin/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/admin/test', auth, (_req, res) => {
  res.json({ ok: true, message: 'Conexión con Railway OK' });
});

app.put('/api/sync/template/:slug', auth, (req, res) => {
  const slug = String(req.params.slug || '').replace(/[^a-z0-9-]/gi, '');
  let html = req.body && req.body.content;
  if (!slug || typeof html !== 'string') {
    return res.status(400).json({ error: 'slug y content (HTML) son obligatorios' });
  }
  const audioPath = resolveRead(path.join('d', 'audio', slug + '.mp3'));
  if (fs.existsSync(audioPath)) {
    html = tplAudio.ensureAudioPlaceholder(html);
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

// Download a self-contained HTML (audio embedded as base64 data URI, no server needed)
app.get('/api/download/template/:slug', auth, (req, res) => {
  const slug = String(req.params.slug || '').replace(/[^a-z0-9-]/gi, '');
  if (!slug) return res.status(400).json({ error: 'slug inválido' });

  let htmlPath, html;
  try {
    htmlPath = resolveRead(path.join('d', slug + '.html'));
  } catch (e) {
    return res.status(404).json({ error: 'Plantilla no encontrada' });
  }
  if (!fs.existsSync(htmlPath)) return res.status(404).json({ error: 'Plantilla no encontrada' });

  html = fs.readFileSync(htmlPath, 'utf8');

  let audioSrc = null;
  try {
    const audioPath = resolveRead(path.join('d', 'audio', slug + '.mp3'));
    if (fs.existsSync(audioPath)) {
      const audioB64 = fs.readFileSync(audioPath).toString('base64');
      audioSrc = 'data:audio/mpeg;base64,' + audioB64;
    }
  } catch (_) {}

  const out = tplAudio.finalizeTemplateHtml(html, slug, audioSrc || null);
  const filename = slug + '-demo.html';
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
  res.send(out);
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
  let rel;
  try {
    rel = decodeURIComponent(req.path.replace(/^\//, ''));
  } catch (_) {
    return res.status(400).send('Bad request');
  }

  // Block any path-traversal attempts before resolveRead can catch them
  if (rel.includes('..') || rel.includes('\0')) return next();

  if (!rel || rel.endsWith('/')) {
    let indexPath;
    try { indexPath = resolveRead(path.join(rel, 'index.html')); } catch (_) { return next(); }
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    return next();
  }

  let filePath;
  try { filePath = resolveRead(rel); } catch (_) { return next(); }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    let processed;
    try { processed = tplAudio.resolveTemplateHtml(rel, resolveRead); } catch (_) {}
    if (processed) return res.type('html').send(processed);
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
