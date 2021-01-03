// const { Router } = require('express');
// const router = Router();

const nodemailer = require("nodemailer");
const smtp = require("../conf/smtp");
const emails = require("../conf/emails");
const uuid = require("uuid4");
const os = require('os');

class mysql {
    constructor() {
        const db_config = require('../conf/db.js');
        var conn = db_config.init();
        db_config.connect(conn);
        
        this.conn = conn;
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
