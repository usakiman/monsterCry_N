// const http = require('http');

// // node 기본 웹서버 시작 (3000번 포트)
// http.createServer( (request, response) => {
//     response.writeHead(200, {'Content-Type' : 'text/plain'})
//     response.write("hello server");
//     response.end();
// }).listen(3000);

const express = require("express");

const admin = require("./routes/admin");
const nunjucks = require("nunjucks");

const app = express();
const port = 3000;

nunjucks.configure("template", {
    autoescape : true,
    express : app
});


app.get('/', (req, res) => {
    res.send("hi express");
});

app.get('/fastcampus', (req, res) => {
    res.send("fastcampus get2222222222");
});

app.use("/admin", admin);

app.listen( port, () => {
    console.log("express listening port", port);
});