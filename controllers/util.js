//const { Router } = require('express');
//const router = Router();

const nodemailer = require("nodemailer");
const smtp = require("../conf/smtp");
const emails = require("../conf/emails");
const uuid = require("uuid4");
const os = require('os');
const path = require('path');   

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
    console.log(info);
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
}

// mysql 커넥터
class mysql {
    constructor() {
        const db_config = require('../conf/db.js');
        var conn = db_config.init();

        try {
            db_config.connect(conn);
        } catch (err) {
            if (err.code === "PROTOCOL_CONNECTION_LOST") {
                console.log("PROTOCOL_CONNECTION_LOST ERR : " + err);
                setTimeout(conn = db_config.init(), 2000);
                db_config.connect(conn);
            }
        } finally {
            this.conn = conn;
        }                        
    }
}
module.exports.mySqlConn = new mysql().conn;

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
            console.error('Send Mail error : ', err);
        }
        else {
            console.log('Message sent : ', info);
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
    console.log(files);

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
    console.log(dir);

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
    console.log(dir);
    
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