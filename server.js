import http from 'http';
import fs from 'fs';
import path from 'path';

const root = process.env.ROOT || '.';
const userHeaders = JSON.parse(process.env.HEAD || '{}');

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
    if (request.method !== 'GET') {
      response.writeHead(405, { 'Content-Type': 'text/plain', ...userHeaders });
      response.write('Method Not Allowed');
      response.end();
      return;
    }

    const url = new URL(request.url, Server.origin);
    const filePath = path.resolve(`${root}${url.pathname}`);
    const fileExt = path.extname(filePath);
    const mimeType = mimeLookup.get(fileExt);

    if (fileExt) {
      if (mimeType) {
        fs.stat(filePath, (error, stats) => {
          if (error || !stats.isFile()) {
            Server.sendFileNotFound(response);
          } else {
            Server.sendFile(response, filePath, mimeType, stats.size);
          }
        });
      } else {
        Server.sendUnknownMimeType(response, fileExt);
      }
    } else if (url.pathname.endsWith('/')) {
      const directoryIndex = path.join(filePath, 'index.html');
      fs.stat(directoryIndex, (error, stats) => {
        if (error || !stats.isFile()) {
          // @TODO Implement pushState functionality for better routing
          Server.sendRootIndex(response);
        } else {
          Server.sendFile(response, directoryIndex, 'text/html', stats.size);
        }
      });
    } else {
      Server.sendRedirect(response, `${url.pathname}/`);
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
    response.writeHead(301, { 'Content-Type': 'text/plain', 'Content-Length': 0, Location: location, ...userHeaders });
    response.end();
  }

  static sendFile(response, filePath, mimeType, contentLength) {
    response.writeHead(200, { 'Content-Type': mimeType, 'Content-Length': contentLength, ...userHeaders });
    fs.createReadStream(filePath).pipe(response);
  }

  static sendRootIndex(response) {
    const rootIndex = path.join(root, 'index.html');
    fs.stat(rootIndex, (error, stats) => {
      if (error || !stats.isFile()) {
        Server.sendFileNotFound(response);
      } else {
        Server.sendFile(response, rootIndex, 'text/html', stats.size);
      }
    });
  }
}

const server = http.createServer(Server.requestListener);

server.listen(process.env.PORT || 8080, () => {
  const { address, port } = server.address();
  Server.origin = `http://${address}:${port}`;
  console.log(`Development server running: ${Server.origin}`); // eslint-disable-line no-console
});
