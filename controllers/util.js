//const { Router } = require('express');
//const router = Router();

const nodemailer = require("nodemailer");
const smtp = require("../conf/smtp");
const emails = require("../conf/emails");
const uuid = require("uuid4");
const os = require('os');
const path = require('path');

const jwt = require("jsonwebtoken");

var dt = require("date-utils");

var winston = require('winston');
const fs = require('fs'); 
const appRoot = require('app-root-path')
const logDir = appRoot + "/logs";
const date = new Date().toFormat("YYYYMMDD");

const logFileApp = appRoot + "/logs/app_" + date + ".log";
const logFileError = appRoot + "/logs/error_" + date + ".log";

// morgan 로그 옵션
var options = {
  file: {
    level: 'info',
    name: 'file.info',
    filename: logFileApp,    
    handleExceptions: true,    
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true,
  },
  errorFile: {
    level: 'error',
    name: 'file.error',
    filename: logFileError,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// 로그 쓰기
exports.log = function (info){
    var hostname = os.hostname();        
    if(hostname === 'MSDN-SPECIAL') {  
        console.log(info);
    } else if (hostname === 'LAPTOP-DI6GLDAU') {
        console.log(info);
    } 
    
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    let logger = winston.createLogger({
        transports: [
          new (winston.transports.Console)(options.console),
          new (winston.transports.File)(options.errorFile),
          new (winston.transports.File)(options.file)          
        ],
        exitOnError: false, // do not exit on handled exceptions
      });
      
    
  try{
      logger.info(new Date().toLocaleTimeString() + " | " + info);
    }catch(exception){
      logger.error("ERROR=>" +exception);      
    }
    return;
}

var inLog = function(info) {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    let logger = winston.createLogger({
        transports: [
          new (winston.transports.Console)(options.console),
          new (winston.transports.File)(options.errorFile),
          new (winston.transports.File)(options.file)          
        ],
        exitOnError: false, // do not exit on handled exceptions
      });
      
    
  try{
      logger.info(new Date().toLocaleTimeString() + " | " + info);
    }catch(exception){
      logger.error("ERROR=>" +exception);      
    }
    return;
}

// mysql 커넥터
class mysql {
    constructor() {
        //const db_config = require('../conf/db.js');
        var conn;
        //var conn = db_config.init(); // createConnection
        //db_config.connect(conn); // connect
        //conn = handleDisconnect();
        //this.conn = conn;
    }
}
module.exports.mySqlConn = new mysql().conn;

// 커넥션 초기화
exports.mysqlInit = function() {    
    this.mysql = new mysql();
    return this.mysql;
}

// connector 오류시 503
exports.mysqlConnecter = function() {    
    var conn;
    conn = handleDisconnect();
    return conn;
}

exports.intervalSelect = function() {
    gMysqlConn.query("SELECT 1", function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
        else {            
            console.log("인터벌 실행 : " + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString());
        }
    });          
}

var handleDisconnect = function() {
    const db_config = require("../conf/db.js");
    var conn = db_config.init();

    conn.connect(function(err) {
        if(err) {
            inLog('error when connecting to db:' + err);
            setTimeout(handleDisconnect, 2000);
        }else{
            console.info("mysql connection successfully.");
        }	
    });
    
    conn.on('error', function(err) { 
        inLog('db error :' + err); 
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            conn.destroy();
            handleDisconnect(); 
        } else if(err.code === 'ER_TOO_MANY_USER_CONNECTIONS') {
            conn.destroy();
            throw err;
        }        
        else { 
            console.info(err);
            throw err;
        } 
    });
    
    // if (conn.state == "authenticated") {
    //     conn.end();        
    // }
    //db_config.connect(conn);

    return conn;
}

// promise 용 rows 쿼리 실행기
exports.queryExec_rows = (sql, params) => new Promise ((resolve, reject) => {
    gMysqlConn.query(sql, params, function (err, rows, fields) {
        err ? reject(err) : resolve(rows) // reject는 예외 처리를 할 때 사용합니다.
    })
});

// promise 용 results 쿼리 실행기
exports.queryExec_results = (sql, params) => new Promise ((resolve, reject) => {
    gMysqlConn.query(sql, params, function (err, rows, fields) {
        err ? reject(err) : resolve(rows) // reject는 예외 처리를 할 때 사용합니다.
    })
});


// 랜덤워드
exports.randomWord = function() {
    return uuid();
}

//이메일전송
exports.emailSender = function(send, title, html) {

    var hostname = os.hostname();        
    if(hostname === 'MSDN-SPECIAL') {  
        html = html.replace(":hostAddress", "http://localhost:8001");
    } else if (hostname === 'LAPTOP-DI6GLDAU') {
        html = html.replace(":hostAddress", "http://localhost:8001");
    } else {
        //html = html.replace(":hostAddress", "http://usaki.cafe24app.com");
        html = html.replace(":hostAddress", "http://www.usaki.co.kr");
    }
    
    var transporter = nodemailer.createTransport({
        service: smtp.gmail.service,
        auth: {
            user : smtp.gmail.user,
            pass : smtp.gmail.password
        }
    });

    var mailOption = {
        from : emails.root.email,
        to : send,
        subject : title,
        html : html
    };

    transporter.sendMail(mailOption, function(err, info) {
        if ( err ) {
            inLog('Send Mail error : ' + err);            
        }
        else {
            inLog('Message sent : ' + info);            
        }
    });    
}

//폴더 리스트읽기
exports.readFolder = function(url) {     
    var dir = "";
    var hostname = os.hostname();        
    if(hostname === 'MSDN-SPECIAL'){
        dir = "\\" + url;
    } else {
        dir = "/" + url;
    }
        
    if (!fs.existsSync(appRoot + dir)) {
        fs.mkdirSync(appRoot + dir);
    }

    var files = fs.readdirSync(appRoot + dir); // 디렉토리를 읽어온다
    inLog(files);

    return files;
}

exports.delFile = function (url,filename) {
    var dir = "";
    var hostname = os.hostname();         
    if(hostname === 'MSDN-SPECIAL'){
        dir = "\\" + url;
    } else {
        dir = "/" + url;
    }
               
    // path join 플래폼별로 정규화해서 리턴해줌        
    dir = path.join(appRoot.toString(),dir, filename);        
    inLog(dir);

    fs.unlinkSync(dir);
}

// 디렉토리 안에 모든 파일 삭제후 폴더도 삭제
exports.delDirAll = function (url) {
    var dir = "";
    var hostname = os.hostname();         
    if(hostname === 'MSDN-SPECIAL'){
        dir = "\\" + url;
    } else {
        dir = "/" + url;
    }
               
    // path join 플래폼별로 정규화해서 리턴해줌        
    dir = path.join(appRoot.toString(),dir);        
    inLog(dir);
    
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);    
}

exports.paging = (page, totalPost, maxPost, maxPage) => {    

    // maxPost와 maxPage가 같으면 됨
    // 다르면 마지막 페이지에서 startPage가 먹지 않는 버그..

    if (page == 0) page = 1;

    let currentPage = page ? parseInt(page) : 1; // (3)
    const hidePost = page === 1 ? 0 : (page - 1) * maxPost; // (4)
    const totalPage = Math.ceil(totalPost / maxPost); // (5)
    
    if (currentPage > totalPage) { // (6)
      currentPage = totalPage;
    }
  
    const startPage = Math.floor(((currentPage - 1) / maxPage)) * maxPage + 1; // (7)
    let endPage = startPage + maxPage - 1; // (8)
  
    if (endPage > totalPage) { // (9)
      endPage = totalPage;
    }
  
    return { startPage, endPage, hidePost, maxPost, totalPage, currentPage }; // (10)
  };



  function generateToken(payload) {
      return new Promise(
        (resolve, reject) => {
            jwt.sign(
                payload,
                "usaki_token_key_20210214",
                {
                    expiresIn: '1h'
                }, (error, token) => {
                    if(error) reject(error);
                    resolve(token);
                }
            );
        }
      );
  }

  function decodeToken(token) {
      return new Promise(
          (resolve, reject) => {
              jwt.verify(token, "usaki_token_key_20210214", (error, decoded) => {
                  if (error) reject(error);
                  resolve(decoded);
              });
          }
      );
  }

  exports.generateToken = generateToken;
  exports.decodeToken = decodeToken;