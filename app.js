// const http = require('http');

// // node 기본 웹서버 시작 (3000번 포트)
// http.createServer( (request, response) => {
//     response.writeHead(200, {'Content-Type' : 'text/plain'})
//     response.write("hello server");
//     response.end();
// }).listen(3000);

const express = require("express");
const nunjucks = require("nunjucks");
const ejs = require("ejs");
const logger = require('morgan');
const bodyParser = require('body-parser');	
const uuid = require("uuid4");
const session = require('express-session');                      
const sessionMysql = require(__dirname + "/conf/sessionMysql");
const fileStore = require("session-file-store")(session);

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
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        
        this.app.use(session({                                              
            //secret: uuid() + "_usaki",
            secret: "keyboard cat",
            resave:false,
            saveUninitialized:true,
            store: new fileStore()
          }))

        // this.app.use(session({
        //     secret: '@#@$MYSIGN#@$#$',
        //     resave: false,
        //     saveUninitialized: true
        //    }));
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

       //this.app.get('/', (req, res) => {
       //  res.render('index')
       //})
    }

    setStatic (){
        this.app.use('/files', express.static( __dirname +'/uploads'));
        this.app.use("/", express.static( __dirname + "/uploads/main"));
    }

    setLocals(){

        // 템플릿 변수
        this.app.use( (req, res, next) => {
            this.app.locals.isLogin = true;
            this.app.locals.req_path = req.path;            
            next();
        });

    }

    getRouting (){
        this.app.use(require('./controllers'))
    }

    status404() {        
        this.app.use( ( req , res, _ ) => {
            res.status(404).render('common/404')
        });
    }

    errorHandler() {

        this.app.use( (err, req, res,  _ ) => {
            console.log(err);
            res.status(500).render('common/500')
        });

    }

}

module.exports = new App().app; 