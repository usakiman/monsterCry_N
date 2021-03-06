//const { json } = require('express');

// const db_config = require('../../conf/db.js');
// var conn = db_config.init();
// db_config.connect(conn);

const util = require("../util");
const fs = require("fs");
const path = require("app-root-path");

exports.post_card_list = (req , res) => {        
    var lvl = req.body.lvl;
    var race = req.body.race;
    var sql = "SELECT * FROM card_info WHERE cardlevel = ':lvl' and cardrace = ':race' ORDER BY cardname";
    sql = sql.replace(":lvl", lvl);                
    sql = sql.replace(":race", race);                

    //var mysql = util.mysqlConnecter();
    gMysqlConn.query(sql, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            res.json(rows);            
        }
    });    
}

exports.post_img_exist = (req, res) => {        
    fs.access(path.resolve("uploads") + "/img_small/" + req.body.cardname + ".jpg" , function(v) {        
        if (v == null) {            
            res.json("/files/img_small/" + req.body.cardname + ".jpg");
        } else {            
            res.json("");
        }
    })
}

exports.post_card_view = ( req , res) => {
    var seq = req.body.seq;
    var sql = "SELECT * FROM card_info WHERE seq = :seq ";
    sql = sql.replace(":seq", seq);                

    //var mysql = util.mysqlConnecter();
    gMysqlConn.query(sql, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {                            
            res.json(rows);                            
        }
    });      
}

exports.post_card_join = (req, res) => {
    const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    var uid = req.body.uid.toLowerCase();
    var pwd = req.body.pwd.toLowerCase();
    var email = req.body.email.toLowerCase();
    var nickname = req.body.nickname;
    var sql = "SELECT count(*) as cnt FROM user_table WHERE uid = LOWER(?)";
    var sqlInsert = "INSERT INTO user_table (uid, pwd, nickname, email, cre_date) VALUES (?, MD5(?), ?, ?, CAST(NOW() AS DATE))";
    var params = [uid];
    var params2 = [uid, pwd, nickname, email];
    var vFlag = 0;

    var emailTemplete = "uid : " + uid + "<br/>";
    emailTemplete += "email : " + email + "<br/>";
    emailTemplete += "nickname : " + nickname + "<br/>";
    emailTemplete += "ip : " + ip + "<br/>";
    emailTemplete += "<a href=':hostAddress' target='_blank'>???????????? ??????</a>";

    util.emailSender("choiyw2@gmail.com", "[????????? ???????????? ??????] "+nickname+" ?????? ????????? ??????????????????.", emailTemplete);
    
    util.log(sql);

    (async () => {
        try {
            const res1 = await util.queryExec_results(sql, params);
            
            var resultMsg = "";
            if (res1[0].cnt === 1) {
                resultMsg = "?????? ???????????? ??????????????????.";
            } else {
                const res2 = await util.queryExec_rows(sqlInsert, params2);

                util.log("insert execute --> UserID = "+res2.insertId);
                resultMsg = "SUCCESS";                
            }
            
            res.json(resultMsg);
        } catch (err) {
            util.log(err)
        }
    })();    

    /*
    gMysqlConn.query(sql, params, function (err, result, fields) {
        if(err) util.log('query is not excuted.\n' + err);
        else {            
            if (result[0].cnt === 1) {
                vFlag == 1;
                res.json("?????? ???????????? ??????????????????.");
            }                                    
        }
    });      

    if (vFlag == 0) {
        gMysqlConn.query(sqlInsert, params2, function(err, rows, fields) {
            if (err) util.log('query is not excuted.\n' + err);
            else {
                util.log("insert execute --> UserID = "+rows.insertId);
                res.json("SUCCESS");
            }
        });        
    }
    */    
}

exports.post_card_logout = (req, res) => {
    req.session.destroy(function(err) {                
        //req.session.isLogin = false;
        //req.isLogin = true;
        //req.session.loginID = "";    

        res.cookie('access_token', null, {
            maxAge: 0,
            httpOnly:true
        });
        
        util.log("logout");

        res.json("SUCCESS");
    });  
}

exports.post_card_login = async (req, res) => {    
    const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    var uid = req.body.uid.toLowerCase();
    var pwd = req.body.pwd.toLowerCase();    
    var code = req.body.code.toLowerCase();    
    // ???????????????
    var sql = "SELECT count(*) as cnt FROM user_table WHERE uid = ':uid';";
    sql = sql.replace(":uid", uid);
    // ????????????
    var sqlLogin = "SELECT * FROM user_table WHERE uid = ? AND pwd = md5(?)";
    var params = [uid, pwd];
    // ip??????
    var sqlIP = "INSERT INTO user_login_info (seq_fk, user_ip, cre_date) SELECT (SELECT seq FROM user_table WHERE uid = ?), ?, NOW()";
    var params2 = [uid, ip];
    // ????????? ???????????????
    var sqlUpdate = "UPDATE user_table SET last_login = NOW() WHERE uid = ':uid'";
    sqlUpdate = sqlUpdate.replace(":uid", uid);
    
    util.log(sql);

    (async () => {
        try {
            const res1 = await util.queryExec_results(sql, "");
            const res2 = await util.queryExec_results(sqlLogin, params);

            if (res1[0].cnt == 1) {
                var correct = 0;
                var status = -1;
                var vcode = "";                        
                
                res2.forEach(element => {
                    correct = 1;
                    status = element.STATUS || element.status;
                    vcode = element.loginCode;                            
                });

                util.log("status["+status+"] vcode["+vcode+"] code["+code+"]");
                util.log("status["+status+"] vcode["+vcode+"] code["+code+"]");

                if (correct == 1) {
                                                        
                    if (status <= 0 || status == undefined) {
                        res.json("????????? ???????????????.");
                    } else {                            
                        if (vcode == code) {                                    
                            req.session.isLogin = true;                            
                            req.session.loginID = uid;
                            req.session.loginType = status;                                    
                            req.session.cookie.maxAge = (60 * 60000); // ?????? ?????? 60???
                            req.session.link = null;
                            req.session.link2 = null;
                            if (status == 3 || status == 4) {
                                req.session.link = "/admin/confirm";
                                req.session.link2 = "/asmonel";
                            }
                            if (status == 2) {
                                req.session.link2 = "/asmonel";
                            }                                    
                            req.session.save(function() {

                            })
                            req.session.touch();

                            global.gLoginID = uid;
                            util.log(req.session);
                                                     
                            res.cookie('access_token', await util.generateToken({loginid : uid}), { httpOnly: true, maxAge: 60 * 60000});                              

                            const res3 = await util.queryExec_rows(sqlIP, params2);
                            const res4 = await util.queryExec_rows(sqlUpdate, "");

                            res.json("SUCCESS");
                        } else {
                            res.json("????????? ???????????? ????????????.");
                        }                                         
                    }
                                                                   
                } else{
                    res.json("??????????????? ???????????? ????????????.");
                }  
            } else {
                res.json("?????? ???????????? ?????? ?????? ????????????.");
            }
                        
        } catch (err) {
            util.log(err)
        }
    })();
        
    // gMysqlConn.query(sql, function (err, result, fields) {
    //     if(err) util.log('query is not excuted. select fail\n' + err);
    //     else {            
    //         // ????????? ??????
    //         if (result[0].cnt == 1) {
    //             util.log(sqlLogin);
    //             gMysqlConn.query(sqlLogin, params, function (err, result, fields) {
    //                 if(err) util.log('query is not excuted. select fail\n' + err);
    //                 else {                  

    //                     var correct = 0;
    //                     var status = -1;
    //                     var vcode = "";                        
                        
    //                     result.forEach(element => {
    //                         correct = 1;
    //                         status = element.STATUS || element.status;
    //                         vcode = element.loginCode;                            
    //                     });

    //                     util.log("status["+status+"] vcode["+vcode+"] code["+code+"]");
    //                     util.log("status["+status+"] vcode["+vcode+"] code["+code+"]");

    //                     if (correct == 1) {
                                                        
    //                         if (status <= 0 || status == undefined) {
    //                             res.json("????????? ???????????????.");
    //                         } else {                            
    //                             if (vcode == code) {                                    
    //                                 req.session.isLogin = true;                            
    //                                 req.session.loginID = uid;
    //                                 req.session.loginType = status;                                    
    //                                 req.session.cookie.maxAge = (60 * 60000); // ?????? ?????? 60???
    //                                 req.session.link = null;
    //                                 req.session.link2 = null;
    //                                 if (status == 3 || status == 4) {
    //                                     req.session.link = "/admin/confirm";
    //                                     req.session.link2 = "/asmonel";
    //                                 }
    //                                 if (status == 2) {
    //                                     req.session.link2 = "/asmonel";
    //                                 }                                    
    //                                 req.session.save(function() {
        
    //                                 })
    //                                 req.session.touch();

    //                                 global.gLoginID = uid;
    //                                 util.log(req.session);
                                                             
    //                                 res.cookie('access_token', util.generateToken({loginid : uid}), { httpOnly: true, maxAge: 60 * 60000});  
        
    //                                 gMysqlConn.query(sqlIP, params2, function(err, rows, fields) {
    //                                     if (err) util.log('query is not excuted.\n' + err);
    //                                     else {
    //                                         util.log("insert execute --> user_login_info seq = "+rows.insertId);                            
    //                                     }
    //                                 });
        
    //                                 gMysqlConn.query(sqlUpdate, function(err, rows, fields) {
    //                                     if (err) util.log('query is not excuted.\n' + err);
    //                                     else {
    //                                         util.log("insert execute --> last login update");
    //                                     }
    //                                 });
        
    //                                 res.json("SUCCESS");
    //                             } else {
    //                                 res.json("????????? ???????????? ????????????.");
    //                             }                                         
    //                         }
                                                                           
    //                     } else{
    //                         res.json("??????????????? ???????????? ????????????.");
    //                     }                        
                                                                                                
    //                 }
    //             });  
                
    //         } else {
    //             res.json("?????? ???????????? ?????? ?????? ????????????.");
    //         }
    //     }
    // });      
};

exports.post_card_write = ( req , res ) => {
    res.send(req.body);
    util.log(req.body);
}

exports.post_card_result = (req, res) => {
    // "actPower" : $("#hidActPower").val(),
    // "skill1_w" : $("#hidActSkill1_w").val(),
    // "skill2_2" : $("#hidActSkill2_w").val(),
    // "attSpeed" : vAttSpeed,
    // "skillSpeed" : vSkillSpeed   

    util.log(req.body);    

    var returnActPower = 0.0;
    var returnSkill1_Wtime = 0.0;
    var returnSkill2_Wtime = 0.0;
    var returnSkill1_chance = 0;
    var returnSkill2_chance = 0;
    var returnSkill1_etc = 0;
    var returnSkill2_etc = 0;
    var tempData = 0.0;

    // ??????
    tempdata = parseFloat(req.body.attSpeed) + 100;
    
    // ?????????
    returnActPower = (parseFloat(req.body.actPower) / tempdata) * 100;
    returnActPower = returnActPower.toPrecision(4);
    
    // ??????
    tempdata = parseFloat(req.body.skillSpeed) + 100;

    // ?????? 1 ?????????    
    returnSkill1_Wtime = (parseFloat(req.body.skill1_w) / tempdata) * 100;    
    returnSkill1_Wtime = returnSkill1_Wtime.toPrecision(4);    

    // ?????? 2 ?????????
    returnSkill2_Wtime = (parseFloat(req.body.skill2_w) / tempdata) * 100;    
    returnSkill2_Wtime = returnSkill2_Wtime.toPrecision(4);                    

    // ?????? 1?????? ????????? ??????
    returnSkill1_chance = returnSkill1_Wtime / returnActPower;
    returnSkill1_chance = Math.ceil(returnSkill1_chance);

    // ?????? 2?????? ????????? ??????
    returnSkill2_chance = returnSkill2_Wtime / returnActPower;
    returnSkill2_chance = Math.ceil(returnSkill2_chance);

    // ????????? ?????? ????????? ??? ????????? skillSpeedEtc1, skillSpeedEtc2
    //actEtctime1 = Math.Round((Convert.ToDouble(this.ddlEtcTime1.SelectedValue) / Convert.ToDouble(skillSpeed)) * 100, 3);
    //actEtctime2 = Math.Round((Convert.ToDouble(this.ddlEtcTime2.SelectedValue) / Convert.ToDouble(skillSpeed)) * 100, 3);

    // ????????? ?????? ????????? skillSpeedEtc1
    returnSkill1_etc = (parseFloat(req.body.skillSpeedEtc1) / tempdata) * 100;
    returnSkill1_etc = returnSkill1_etc.toPrecision(4);

    // ????????? ?????? ????????? ????????? skillSpeedEtc2
    returnSkill2_etc = (parseFloat(req.body.skillSpeedEtc2) / tempdata) * 100;
    returnSkill2_etc = returnSkill2_etc.toPrecision(4);    

    res.json(returnActPower + "," + returnSkill1_Wtime + "," + returnSkill2_Wtime + "," + returnSkill1_chance + "," + returnSkill2_chance + "," + returnSkill1_etc + "," + returnSkill2_etc);
}



exports.get_login_auth = async (req, res) => {
    
    let token = null;
    try {
        token = await util.generateToken({ username : 'usaki'});
    } catch (e) {
        console.log(e)
    }

    res.cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7});      
    res.send(token);  
}

exports.get_logout_auth = (req, res) => {
    res.cookie('access_token', null, {
        maxAge: 0,
        httpOnly:true
    });
    //res.status = 204;

    res.send("logout");
}

exports.get_auth_check = (req, res) => {
    
    console.log(req.session)
    console.log(req.user);

    res.send("check");
}

