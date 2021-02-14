// const http = require('http');

// // node 기본 웹서버 시작 (3000번 포트)
// http.createServer( (request, response) => {
//     response.writeHead(200, {'Content-Type' : 'text/plain'})
//     response.write("hello server");
//     response.end();
// }).listen(3000);

const os = require('os');
const express = require("express");
const nunjucks = require("nunjucks");
const ejs = require("ejs");
const morgan = require('morgan');
const bodyParser = require('body-parser');	
const session = require('express-session');                      
const { response } = require('express');
const path = require('path');   
const mysqlStore = require('express-mysql-session')(session);    
const cookieParser = require("cookie-parser");

global.gLoginID = null;
global.gSocket = null;
global.gSocketCount = 0;
global.gMysqlConn = null;

class App {

    constructor () {
        this.app = express();

        // 뷰엔진 셋팅
        this.setViewEngine();

        // 미들웨어 셋팅
        this.setMiddleWare();

        // 정적 디렉토리 추가
        this.setStatic();

        // 로컬 변수
        this.setLocals();

        // 라우팅
        this.getRouting();

        // 404 페이지를 찾을수가 없음
        this.status404();

        // 에러처리
        this.errorHandler();        
    }


    setMiddleWare (){

        // 미들웨어 셋팅
        this.app.use(morgan('dev'));        
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));   
        
        this.app.use(cookieParser());
        
        const sessionMysql = require(__dirname + "/conf/sessionMysql");
        var hostname = os.hostname();
        var sessionStore = null;
        if(hostname === 'MSDN-SPECIAL') {  
            sessionStore = new mysqlStore(sessionMysql.dev);                    
        } else if (hostname === 'LAPTOP-DI6GLDAU') {
            sessionStore = new mysqlStore(sessionMysql.company);                    
        } else {
            sessionStore = new mysqlStore(sessionMysql.real);
        }
        
        var hour = 3600000; // 60000 = 1분
        this.app.use(session({                                                          
            secret: "usaki key",
            resave:false,
            saveUninitialized:false,
            rolling:false,
            cookie: {  path: '/', httpOnly: true, maxAge: null },
            //cookie:{ expires : new Date(Date.now() + hour)},            
            store : sessionStore            
          }))
        //console.log("expires : " + new Date(Date.now() + hour));
    }

    setViewEngine (){

        /*
        nunjucks.configure('template', {
            autoescape: true,
            express: this.app
        });
        */
       
        this.app.set("view engine", "ejs");
        this.app.engine("html", require('ejs').renderFile);
        this.app.set('views', __dirname + '/views');        
        this.app.use(express.static(__dirname + '/public'));
        this.app.use('/theme', express.static( __dirname +'/theme'));

       //this.app.get('/', (req, res) => {
       //  res.render('index')
       //})
    }

    setStatic (){
        this.app.use('/files', express.static( __dirname +'/uploads'));
        this.app.use("/", express.static( __dirname + "/uploads/main"));
        this.app.use("/usaki_logs", express.static( __dirname + "/logs"));

        this.app.use("/front", express.static(path.join(__dirname, "front")));
        this.app.use("/static", express.static(path.join(__dirname, "front", "static")));
    }

    setLocals(){
        // 템플릿 변수
        this.app.use( (req, res, next) => {
            this.app.locals.isLogin = false;
            this.app.locals.reqPath = req.path;
            this.app.locals.loginCode = "";
            this.app.locals.title = "Dragon Chronicles - monster corp (usaki)";            
            next();
        });
    }

    getRouting (){
        this.app.use(require('./controllers'))
    }

    status404() {        
        this.app.use( (req , res, _ ) => {
            res.status(404).render('common/404', {
                msg : response.status404,
                title : this.app.locals.title
            });
        });
    }

    errorHandler() {
        this.app.use( (err, req, res,  _ ) => {
            //console.log(err);
            res.status(500).render('common/500', {
                msg : err.msg,
                title : this.app.locals.title
            });
        });
    }    
}

module.exports = new App().app;