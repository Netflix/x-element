import http from 'http';
import fs from 'fs';
import path from 'path';

const port = process.env.PORT || 8080;
const root = process.env.ROOT || '.';
const head = process.env.HEAD || null;

const userHeaders = JSON.parse(head);

const mimeLookup = new Map([
  ['.css',  'text/css'],
  ['.html', 'text/html'],
  ['.ico',  'image/x-icon'],
  ['.js',   'application/javascript'],
  ['.json', 'application/json'],
  ['.md', 'text/markdown'],
  ['.png',  'image/png'],
  ['.txt',  'text/plain'],
]);

class Server {
  static requestListener(request, response) {
    if (request.method === 'GET') {
      const fileUrl = request.url;
      const filePath = path.resolve(`${root}/${fileUrl}`);
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
        if (fileUrl.endsWith('/')) {
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
          Server.sendRedirect(response, `${fileUrl}/`);
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
    response.writeHead(200, { 'Content-Type': mimeType, 'Content-Length': contentLength, ...userHeaders });
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

http.createServer(Server.requestListener).listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Development server running: http://localhost:${port}`);
});
