//const { Router } = require('express');
//const router = Router();

const nodemailer = require("nodemailer");
const smtp = require("../conf/smtp");
const emails = require("../conf/emails");
const uuid = require("uuid4");
const os = require('os');

var winston = require('winston');
var moment = require('moment');   //한국시간을 나타내기 위한 모듈
const fs = require('fs'); 
const appRoot = require('app-root-path')
const logDir = appRoot + "/logs";
const date = new Date().toLocaleDateString().replace("-", "_");

const logFileApp = appRoot + "/logs/app_" + date + ".log";
const logFileError = appRoot + "/logs/error_" + date + ".log";

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

exports.randomWord = function() {
    return uuid();
}

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