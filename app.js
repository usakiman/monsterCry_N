//const http = require("http");

// // node 기본 웹서버 시작 (3000 port)
//http.createServer( (request, response) => {
//  response.writeHead(200, {'Content-Type' : 'text/plain'})
//  response.write("hello server")
//  response.end();
//}
//).listen(3000);

const express = require("express");

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send("hi express");
});

app.get('/fastcampus', (req, res) => {
  res.send("fastcampus routing server go");
});

app.listen( port, () => {
  console.log("express listening port", port);
});
