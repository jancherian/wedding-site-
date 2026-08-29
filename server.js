const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.ics': 'text/calendar; charset=utf-8'
};

process.on('uncaughtException', (err) => {
  console.error('Server handled uncaughtException:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Server handled unhandledRejection:', reason);
});

const server = http.createServer((req, res) => {
  req.on('error', () => {});
  res.on('error', () => {});

  const cleanUrl = (req.url || '/').split('?')[0];
  if (cleanUrl === '/ws' || cleanUrl === '/manifest.json') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{}');
    return;
  }

  let reqPath = cleanUrl === '/' ? 'index.html' : cleanUrl;
  let filePath = path.normalize(path.join(__dirname, reqPath));

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500);
        res.end();
      }
    });
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(PORT, () => {
  console.log(`Wedding Website Server running at http://localhost:${PORT}`);
});

// Keep process active
if (process.stdin.isTTY) {
  process.stdin.resume();
}
setInterval(() => {}, 60000);
