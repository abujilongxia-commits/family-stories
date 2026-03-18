#!/usr/bin/env node
/**
 * Local sync server for image-selector.html (file://) to write reader/config.json.
 * No dependencies: uses Node's built-in http/fs/path.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
 
const PORT = Number(process.env.PORT || 18790);
const projectRoot = path.resolve(__dirname, '..');
const readerConfigPath = path.join(projectRoot, 'reader', 'config.json');
 
function readJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
 
function writeJsonAtomic(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, filePath);
}
 
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    // Allow file:// (Origin: null) to POST here
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
  });
  res.end(body);
}
 
function collectBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
 
function normalizeEpisodeId(id) {
  const m = /^episode([1-9])$/.exec(id);
  return m ? `episode${m[1]}` : null;
}
 
const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
      });
      res.end();
      return;
    }
 
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
 
    if (req.method === 'GET' && pathname === '/health') {
      sendJson(res, 200, { ok: true, port: PORT, readerConfigPath });
      return;
    }
 
    if (req.method === 'POST' && pathname === '/sync/all') {
      const raw = await collectBody(req);
      const payload = JSON.parse(raw || '{}');
      const selectedImages = payload?.selectedImages;
      if (!selectedImages || typeof selectedImages !== 'object') {
        sendJson(res, 400, { ok: false, error: 'Missing selectedImages object' });
        return;
      }
 
      const current = readJsonSafe(readerConfigPath, {});
      const next = {
        ...current,
        selectedImages: { ...(current.selectedImages || {}), ...selectedImages },
        exportedAt: payload.exportedAt || new Date().toISOString(),
        totalSelected:
          typeof payload.totalSelected === 'number'
            ? payload.totalSelected
            : Object.values(selectedImages).reduce((t, arr) => t + (Array.isArray(arr) ? arr.length : 0), 0),
      };
 
      writeJsonAtomic(readerConfigPath, next);
      sendJson(res, 200, { ok: true, updated: 'all', path: readerConfigPath });
      return;
    }
 
    const episodeSyncPrefix = '/sync/episode/';
    if (req.method === 'POST' && pathname.startsWith(episodeSyncPrefix)) {
      const episodeIdRaw = pathname.slice(episodeSyncPrefix.length);
      const episodeId = normalizeEpisodeId(episodeIdRaw);
      if (!episodeId) {
        sendJson(res, 400, { ok: false, error: `Invalid episode id: ${episodeIdRaw}` });
        return;
      }
 
      const raw = await collectBody(req);
      const payload = JSON.parse(raw || '{}');
      const images = payload?.images;
      if (!Array.isArray(images)) {
        sendJson(res, 400, { ok: false, error: 'Missing images array' });
        return;
      }
 
      const current = readJsonSafe(readerConfigPath, {});
      const selectedImages = { ...(current.selectedImages || {}) };
      selectedImages[episodeId] = images;
 
      const next = {
        ...current,
        selectedImages,
        exportedAt: new Date().toISOString(),
        totalSelected: Object.values(selectedImages).reduce((t, arr) => t + (Array.isArray(arr) ? arr.length : 0), 0),
      };
 
      writeJsonAtomic(readerConfigPath, next);
      sendJson(res, 200, { ok: true, updated: episodeId, count: images.length, path: readerConfigPath });
      return;
    }
 
    sendJson(res, 404, { ok: false, error: 'Not found' });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || String(error) });
  }
});
 
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[sync-server] listening on http://127.0.0.1:${PORT}`);
  console.log(`[sync-server] will write ${readerConfigPath}`);
  console.log(`[sync-server] health: http://127.0.0.1:${PORT}/health`);
});

