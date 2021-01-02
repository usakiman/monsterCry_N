//const { json } = require('express');

// const db_config = require('../../conf/db.js');
// var conn = db_config.init();
// db_config.connect(conn);

const util = require("../util");

exports.post_card_list = (req , res) => {        
    var lvl = req.body.lvl;
    var sql = "SELECT * FROM card_info WHERE cardlevel = ':lvl' ORDER BY cardname";        
    sql = sql.replace(":lvl", lvl);        
    
    console.log(sql);
    if (req.session.isLogin == null) res.json(null);

    util.mySqlConn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
        else {            
            res.json(rows);
            //console.log(rows);
        }
    });    
}

exports.post_card_view = ( req , res) => {
    var seq = req.body.seq;
    var sql = "SELECT * FROM card_info WHERE seq = :seq ";
    sql = sql.replace(":seq", seq);        
    
    console.log(sql);
    if (req.session.isLogin == null) res.json(null);

    util.mySqlConn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
        else {            
            res.json(rows);
            //console.log(rows);
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
    emailTemplete += "<a href=':hostAddress' target='_blank'>사이트로 이동</a>";

    util.emailSender("choiyw2@gmail.com", "[사이트 회원가입 신청] "+nickname+" 님의 신청이 들어왔습니다.", emailTemplete);
    
    console.log(sql);

    util.mySqlConn.query(sql, params, function (err, result, fields) {
        if(err) console.log('query is not excuted.\n' + err);
        else {            
            if (result[0].cnt === 1) {
                vFlag == 1;
                res.json("해당 아이디는 사용중입니다.");
            }                                    
        }
    });  

    if (vFlag == 0) {
        util.mySqlConn.query(sqlInsert, params2, function(err, rows, fields) {
            if (err) console.log('query is not excuted.\n' + err);
            else {
                console.log("insert execute --> UserID = "+rows.insertId);
                res.json("SUCCESS");
            }
        });
    }
    

}

exports.post_card_logout = (req, res) => {
    req.session.destroy(function(err) {
        
        //req.session.isLogin = false;
        //req.isLogin = true;
        //req.session.loginID = "";        

        res.json("SUCCESS");
    });  
}

exports.post_card_login = (req, res) => {    
    const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    var uid = req.body.uid.toLowerCase();
    var pwd = req.body.pwd.toLowerCase();    
    var code = req.body.code.toLowerCase();    
    // 아이디체크
    var sql = "SELECT count(*) as cnt FROM user_table WHERE uid = ':uid';";
    sql = sql.replace(":uid", uid);
    // 비번체크
    var sqlLogin = "SELECT * FROM user_table WHERE uid = ? AND pwd = md5(?)";
    var params = [uid, pwd];
    // ip입력
    var sqlIP = "INSERT INTO user_login_info (seq_fk, user_ip, cre_date) SELECT (SELECT seq FROM user_table WHERE uid = ?), ?, NOW()";
    var params2 = [uid, ip];
    // 마지막 로그인시간
    var sqlUpdate = "UPDATE user_table SET last_login = NOW() WHERE uid = ':uid'";
    sqlUpdate = sqlUpdate.replace(":uid", uid);
    
    console.log(sql);
    util.mySqlConn.query(sql, function (err, result, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
        else {              
            // 아이디 체크
            if (result[0].cnt == 1) {
                console.log(sqlLogin);
                util.mySqlConn.query(sqlLogin, params, function (err, result, fields) {
                    if(err) console.log('query is not excuted. select fail\n' + err);
                    else {                  

                        var correct = 0;
                        var status = -1;
                        var vcode = "";
                        
                        result.forEach(element => {
                            correct = 1;
                            status = element.STATUS || element.status;
                            vcode = element.loginCode;
                        });

                        console.log("status["+status+"] vcode["+vcode+"] code["+code+"]");

                        if (correct == 1) {
                                                        
                            if (status <= 0 || status == undefined) {
                                res.json("승인이 필요합니다.");
                            } else {                            
                                if (vcode == code) {
                                    console.log(req.session);
                                    req.session.isLogin = true;                            
                                    req.session.loginID = uid;
                                    req.session.loginType = status;
                                    req.session.link = null;
                                    if (status == 3 || status == 4) {
                                        req.session.link = "/admin/confirm";
                                    }                                    
                                    // req.session.save(function() {
        
                                    // })
        
                                    util.mySqlConn.query(sqlIP, params2, function(err, rows, fields) {
                                        if (err) console.log('query is not excuted.\n' + err);
                                        else {
                                            console.log("insert execute --> user_login_info seq = "+rows.insertId);                            
                                        }
                                    });
        
                                    util.mySqlConn.query(sqlUpdate, function(err, rows, fields) {
                                        if (err) console.log('query is not excuted.\n' + err);
                                        else {
                                            console.log("insert execute --> last login update");
                                        }
                                    });
        
                                    res.json("SUCCESS");
                                } else {
                                    res.json("코드가 일치하지 않습니다.");
                                }                                         
                            }
                                                                           
                        } else{
                            res.json("패스워드가 일치하지 않습니다.");
                        }                        
                                                                                                
                    }
                });  
                
            } else {
                res.json("해당 아이디는 존재 하지 않습니다.");
            }
        }
    });            
};

exports.post_card_write = ( req , res ) => {
    res.send(req.body);
    console.log(req.body);
}

exports.post_card_result = (req, res) => {
    // "actPower" : $("#hidActPower").val(),
    // "skill1_w" : $("#hidActSkill1_w").val(),
    // "skill2_2" : $("#hidActSkill2_w").val(),
    // "attSpeed" : vAttSpeed,
    // "skillSpeed" : vSkillSpeed   

    console.log(req.body);
    if (req.session.isLogin == null) res.json(null);

    var returnActPower = 0.0;
    var returnSkill1_Wtime = 0.0;
    var returnSkill2_Wtime = 0.0;
    var returnSkill1_chance = 0;
    var returnSkill2_chance = 0;
    var tempData = 0.0;

    // 공속
    tempdata = parseFloat(req.body.attSpeed) + 100;
    
    // 행동력
    returnActPower = (parseFloat(req.body.actPower) / tempdata) * 100;
    returnActPower = returnActPower.toPrecision(4);
    
    // 스속
    tempdata = parseFloat(req.body.skillSpeed) + 100;

    // 스킬 1 쿨타임    
    returnSkill1_Wtime = (parseFloat(req.body.skill1_w) / tempdata) * 100;    
    returnSkill1_Wtime = returnSkill1_Wtime.toPrecision(4);    

    // 스킬 2 쿨타임
    returnSkill2_Wtime = (parseFloat(req.body.skill2_w) / tempdata) * 100;    
    returnSkill2_Wtime = returnSkill2_Wtime.toPrecision(4);                    

    // 스킬 1번째 초기화 순번
    returnSkill1_chance = returnSkill1_Wtime / returnActPower;
    returnSkill1_chance = Math.ceil(returnSkill1_chance);

    // 스킬 2번째 초기화 순번
    returnSkill2_chance = returnSkill1_Wtime / returnActPower;
    returnSkill2_chance = Math.ceil(returnSkill2_chance);            

    res.json(returnActPower + "," + returnSkill1_Wtime + "," + returnSkill2_Wtime + "," + returnSkill1_chance + "," + returnSkill2_chance);
}