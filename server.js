import http from 'http';
import fs from 'fs';
import path from 'path';

const root = process.env.ROOT || '.';
const userHeaders = JSON.parse(process.env.HEAD || null);

const mimeLookup = new Map([
  ['.css',  'text/css'],
  ['.html', 'text/html'],
  ['.ico',  'image/x-icon'],
  ['.js',   'application/javascript'],
  ['.json', 'application/json'],
  ['.md',   'text/markdown'],
  ['.png',  'image/png'],
  ['.txt',  'text/plain'],
]);

class Server {

  static origin;

  static requestListener(request, response) {
    if (request.method === 'GET') {
      const url = new URL(request.url, Server.origin);

      // Handle favicon.ico requests with 204 No Content
      if (url.pathname === '/favicon.ico') {
        response.writeHead(204, { ...userHeaders });
        response.end();
        return;
      }

      const filePath = path.resolve(`${root}/${url.pathname}`);
      const fileExt = path.extname(filePath);
      const mimeType = mimeLookup.get(fileExt);

      if (fileExt) {
        if (mimeType) {
          fs.stat(filePath, (error, stats) => {
            if (stats) {
              Server.sendFile(response, filePath, mimeType, stats.size);
            } else {
              Server.sendFileNotFound(response);
            }
          });
        } else {
          Server.sendUnknownMimeType(response, fileExt);
        }
      } else {
        if (url.pathname.endsWith('/')) {
          const directoryIndex = `${filePath}/index.html`;
          fs.stat(directoryIndex, (error, stats) => {
            if (stats) {
              Server.sendFile(response, directoryIndex, 'text/html', stats.size);
            } else {
              // @TODO pushState optional
              Server.sendRootIndex(response);
            }
          });
        } else {
          Server.sendRedirect(response, `${url.pathname}/`);
        }
      }
    }
  }

  static sendUnknownMimeType(response, fileExt) {
    const message = `Error 500: Unknown MIME type for file extension: ${fileExt}`;
    response.writeHead(500, { 'Content-Type': 'text/plain', 'Content-Length': message.length, ...userHeaders });
    response.write(message);
    response.end();
  }

  static sendFileNotFound(response) {
    const message = 'Error 404: Resource not found.';
    response.writeHead(404, { 'Content-Type': 'text/plain', 'Content-Length': message.length, ...userHeaders });
    response.write(message);
    response.end();
  }

  static sendRedirect(response, location) {
    response.writeHead(301, { 'Content-Type': 'text/plain', 'Content-Length': 0, location, ...userHeaders });
    response.end();
  }

  static sendFile(response, filePath, mimeType, contentLength) {
    const headers = { 'Content-Type': mimeType, 'Content-Length': contentLength, ...userHeaders };
    
    // Add COOP/COEP headers for HTML documents to enable cross-origin isolation
    if (mimeType === 'text/html') {
      headers['Cross-Origin-Opener-Policy'] = 'same-origin';
      headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
    }
    
    response.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(response);
  }

  static sendRootIndex(response) {
    const rootIndex = `${root}/index.html`;
    fs.stat(rootIndex, (error, stats) => {
      if (stats) {
        Server.sendFile(response, rootIndex, 'text/html', stats.size);
      } else {
        Server.sendFileNotFound(response);
      }
    });
  }
}

const server = http.createServer(Server.requestListener);

server.listen(process.env.PORT || 8080, () => {
  const { address, port } = server.address();
  Server.origin = `http://[${address}]:${port}`;
  console.log(`Development server running: ${Server.origin}`); // eslint-disable-line no-console
});
