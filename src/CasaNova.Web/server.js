import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

const distPath = path.resolve('./dist');
const port = process.env.PORT || 80;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = `${distPath}${parsedUrl.pathname}`;

  if (parsedUrl.pathname === '/' || path.extname(parsedUrl.pathname) === '') {
    pathname = path.join(distPath, 'index.html');
  }

  fs.readFile(pathname, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(distPath, 'index.html'), (error, file) => {
          if (error) {
            res.writeHead(500);
            res.end('Internal Server Error');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(file);
        });
        return;
      }

      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }

    const ext = path.extname(pathname);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Static server running on http://0.0.0.0:${port}`);
});
