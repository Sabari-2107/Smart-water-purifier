const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const pageName = 'NEXZORA – Smart Water Purification & Monitoring.html';
const pagePath = path.join(__dirname, pageName);
const requestedPort = Number.parseInt(process.env.PORT || '4173', 10);
const host = '127.0.0.1';

if (!Number.isInteger(requestedPort) || requestedPort < 1 || requestedPort > 65535) {
  console.error('PORT must be a number between 1 and 65535.');
  process.exit(1);
}

if (!fs.existsSync(pagePath)) {
  console.error(`Could not find the website file: ${pagePath}`);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url || '/', `http://${host}`).pathname;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method not allowed');
    return;
  }

  if (pathname !== '/' && pathname !== `/${encodeURIComponent(pageName)}`) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store'
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  fs.createReadStream(pagePath).pipe(res);
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${requestedPort} is already in use. Set PORT to another available port and try again.`);
  } else {
    console.error('Could not start the local website:', error.message);
  }
  process.exit(1);
});

server.listen(requestedPort, host, () => {
  console.log(`NEXZORA is running at http://localhost:${requestedPort}`);
  console.log('Demo data is simulated in your browser and saved in local storage.');
  console.log('Press Ctrl+C to stop the server.');
});