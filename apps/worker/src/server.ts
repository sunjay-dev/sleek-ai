import http from "node:http";

http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end("ok");
  })
  .listen(3100, "0.0.0.0");
