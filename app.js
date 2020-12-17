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
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

nunjucks.configure("template", {
    autoescape : true,
    express : app
});

// 미들웨어 셋팅
app.use( logger("dev") );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));

app.use("/files", express.static("uploads"));

app.get('/', (req, res) => {
    res.send("hi express");
});

app.get('/fastcampus', (req, res) => {
    res.send("fastcampus get2222222222");
});

function vipMiddleWare(req, res, next) {
    console.log("최우선 middleware");
    next();
}

app.use("/admin", vipMiddleWare, admin);

app.listen( port, () => {
    console.log("express listening port", port);
});