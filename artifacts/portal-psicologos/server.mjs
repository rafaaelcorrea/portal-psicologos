import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDirectory = join(fileURLToPath(new URL('.', import.meta.url)), 'public');
const port = Number(process.env.PORT || 22313);

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

function safePath(urlPath) {
  const requestedPath = decodeURIComponent(urlPath.split('?')[0]);
  const filePath = normalize(join(publicDirectory, requestedPath === '/' ? 'index.html' : requestedPath));
  return filePath.startsWith(publicDirectory) ? filePath : null;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

const server = createServer(async (request, response) => {
  const requestedPath = safePath(request.url || '/');
  if (!requestedPath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  const filePath = (await fileExists(requestedPath))
    ? requestedPath
    : join(publicDirectory, 'index.html');
  const contentType = MIME_TYPES[extname(filePath)] || 'application/octet-stream';

  response.writeHead(200, {
    'Cache-Control': 'no-cache',
    'Content-Type': contentType,
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`ClaraMente static server running on http://localhost:${port}`);
});