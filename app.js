'use strict';

const http = require('http');
const url = require('url');
const router = require('./router');

http.createServer(function (req, res) {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {
      'Content-Type': 'image/x-icon'
    });
    res.end();
  }
  let path = url.parse(req.url).pathname;
  let currentRoute = router.match(path);
  if (currentRoute) {
    currentRoute.fn(req, res, currentRoute);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.end();
  }
}).listen(3000, function (err) {
  if (err) throw err;
  console.log('Server is running on port 3000');
});