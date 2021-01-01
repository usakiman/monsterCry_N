// const { Router } = require('express');
// const router = Router();

const nodemailer = require("nodemailer");
const smtp = require("../conf/smtp");

class mysql {
    constructor() {
        const db_config = require('../conf/db.js');
        var conn = db_config.init();
        db_config.connect(conn);
        
        this.conn = conn;
    }
}

module.exports.mySqlConn = new mysql().conn;

exports.emailSender = function(send, title, html) {
    
    var transporter = nodemailer.createTransport({
        service: smtp.gmail.service,
        auth: {
            user : smtp.gmail.user,
            pass : smtp.gmail.password
        }
    });

    var mailOption = {
        from : smtp.gmail.email,
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
