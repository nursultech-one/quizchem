// Classroom server for the quiz. No dependencies: just run  `node server.js`
// It only relays messages between the board (teacher) and the phones (students) of the same PIN.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const rooms = new Map(); // pin -> Map(clientId -> response)

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const pin = (u.searchParams.get('pin') || '').slice(0, 16);
  const cid = (u.searchParams.get('cid') || '').slice(0, 32);

  if (u.pathname === '/events') {
    res.writeHead(200, {'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform',
                        'Connection': 'keep-alive', 'X-Accel-Buffering': 'no'});
    res.write('retry: 1000\n\n');
    let room = rooms.get(pin);
    if (!room) { room = new Map(); rooms.set(pin, room); }
    room.set(cid, res);
    const hb = setInterval(() => res.write(':hb\n\n'), 15000);
    res.on('close', () => { clearInterval(hb); room.delete(cid); if (!room.size) rooms.delete(pin); });
    return;
  }
  if (u.pathname === '/send' && req.method === 'POST') {
    let body = '';
    req.on('data', d => { body += d; if (body.length > 65536) req.destroy(); });
    req.on('end', () => {
      const room = rooms.get(pin);
      if (room) {
        const line = 'data: ' + body.replace(/[\r\n]+/g, ' ') + '\n\n';
        room.forEach((r, id) => { if (id !== cid) r.write(line); });
      }
      res.writeHead(204); res.end();
    });
    return;
  }
  if (u.pathname === '/ping') { res.writeHead(200, {'Content-Type': 'text/plain'}); return res.end('ok-kq'); }
  if (u.pathname === '/' || u.pathname === '/index.html') {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache'});
    return fs.createReadStream(INDEX).pipe(res);
  }
  res.writeHead(404); res.end('Not found');
}).listen(PORT, '0.0.0.0', () => {
  console.log('\nQuiz server is running.\n');
  console.log('  Teacher (board) opens:  http://localhost:' + PORT);
  Object.values(os.networkInterfaces()).flat().filter(i => i && i.family === 'IPv4' && !i.internal)
    .forEach(i => console.log('  Students open (same Wi-Fi):  http://' + i.address + ':' + PORT));
  console.log('\nStop with Ctrl+C.\n');
});
