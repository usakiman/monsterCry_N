const util = require("../util");

exports.get_products = ( req , res) => {    
    res.render( './admin/products' , 
        { message : "hello",
        online : "express",
        title: "관리자 리스트",
        bodyId: req.url        
        } // message 란 변수를 템플릿으로 내보낸다.
    );
}

exports.post_products_write = ( req , res ) => {
    res.send(req.body);
    util.log(req.body);
} 

exports.get_confirm = ( req , res) => {        
    var sql = "SELECT * FROM user_table WHERE STATUS = 0 order by seq desc";    

    var mysql = util.mysqlConnecter();
    mysql.query(sql, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            res.render( './admin/confirm' , 
            { 
                list:rows,
                title: "관리자 메뉴",
                bodyId: req.url        
            }
        ); 
        }
    });          
}

exports.get_userlist = (req, res) => {
    var sqlTotal = "SELECT COUNT(*) AS cnt,	CASE WHEN COUNT(*) = 0 THEN 1 ELSE CEIL(COUNT(*) / ?) END AS gcnt ";
    sqlTotal += " FROM ( SELECT @rownum := @rownum + 1 AS rownum, a.* ";
    sqlTotal += " FROM ( SELECT a.*, CASE STATUS WHEN 0 THEN '승인전' WHEN 1 THEN '외부' WHEN 2 THEN '몬주' WHEN 3 THEN '관리자' END AS statusHan  ";
    sqlTotal += " FROM user_table a WHERE a.STATUS > 0 AND a.STATUS < 4 ORDER BY a.seq ASC ";
    sqlTotal += " ) a, (SELECT @rownum := 0) rn ORDER BY rownum DESC ";
    sqlTotal += " ) a ";                                    
    
    //var sql = "SELECT a.*, CASE STATUS WHEN 0 THEN '승인전' WHEN 1 THEN '외부' WHEN 2 THEN '몬주' WHEN 3 THEN '관리자' END AS statusHan FROM user_table a WHERE a.STATUS > 0 and a.STATUS < 4 order by a.seq desc";

    var sql = "SELECT * FROM (	SELECT @rownum := @rownum + 1 AS rownum, a.* ";
    sql += " FROM ( SELECT a.*, CASE STATUS WHEN 0 THEN '승인전' WHEN 1 THEN '외부' WHEN 2 THEN '몬주' WHEN 3 THEN '관리자' END AS statusHan  ";
    sql += " FROM user_table a WHERE a.STATUS > 0 AND a.STATUS < 4 ORDER BY a.seq ASC) a, (SELECT @rownum := 0) rn ORDER BY rownum DESC ";
    sql += " ) a LIMIT ? OFFSET ? ";                            

    var tot_cnt = 0;
    var page_cnt = 0;
    var page_size = 5;
    var page_list_size = 5;

    var noPage = 0;

    if (req.params.noParam == undefined)
        noPage = 1;
    else
        noPage = req.params.noParam;
    
    var paramsTotal = [page_size];
    
    var mysql = util.mysqlConnecter();
    mysql.query(sqlTotal, paramsTotal, function (err, result, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            if (result != null) {
                tot_cnt = result[0].cnt;
                page_cnt = result[0].gcnt;
                
                var paging = util.paging(noPage, tot_cnt, page_size, page_list_size);
                var params = [page_size, paging.hidePost];    

                console.log(paging);
                    
                mysql.query(sql, params, function (err, rows, fields) {
                    if(err) util.log('query is not excuted. select fail\n' + err);
                    else {            
                        res.render( './admin/userlist' , 
                        { 
                            list:rows,
                            result:paging,
                            tot:tot_cnt,
                            gcnt:page_cnt,
                            title: "관리자 메뉴",
                            bodyId: req.url        
                        }
                    ); 
                    }
                });            
            }
        }
    });                
}

exports.post_confirm = ( req , res ) => {

    util.log(req.body);

    var seq = req.body.seq;
    var type = req.body.type;
    var rWord = util.randomWord().substr(0, 6);

    var sql = "UPDATE user_table SET STATUS = ?, loginCode = ? WHERE seq = ?";    
    var params = [type, rWord, seq];            
    
    var sqlUser = "SELECT * FROM user_table WHERE seq = ? ";
    var params2 = [seq];            
        
    var mysql = util.mysqlConnecter();
    mysql.query(sqlUser, params2, function (err, result, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            if (result[0].seq == seq) {
                var uid = result[0].uid;
                var email = result[0].email;
                var nickname = result[0].nickname;

                var emailTemplete = "안녕하세요<br/>";
                emailTemplete += "신청하신 id의 승인코드 입니다. <br/>";
                emailTemplete += "id : " + uid + "<br/>";
                emailTemplete += "email : " + email + "<br/>";
                emailTemplete += "nickname : " + nickname + "<br/>";
                emailTemplete += "승인코드 : " + rWord + "<br/>";
                emailTemplete += "<a href=':hostAddress' target='_blank'>사이트로 이동</a>";

                mysql.query(sql, params, function (err, result, fields) {
                    if(err) util.log('query is not excuted.\n' + err);
                    else {                        
                        if (email != "") {
                            util.emailSender(email, "[usaki.co.kr 승인완료 되었습니다 코드확인하세요]", emailTemplete);
                        }

                        res.json("SUCCESS");
                    }
                });                                                          
            }
        }
    });          
} 

exports.post_confirm_change = ( req , res ) => {

    util.log(req.body);

    var seq = req.body.seq;
    var type = req.body.type;    

    var sql = "UPDATE user_table SET STATUS = ? WHERE seq = ?";    
    var params = [type, seq];            
    
    var sqlUser = "SELECT * FROM user_table WHERE seq = ? ";
    var params2 = [seq];            
        
    var mysql = util.mysqlConnecter();
    mysql.query(sqlUser, params2, function (err, result, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            if (result[0].seq == seq) {
                var uid = result[0].uid;
                var email = result[0].email;
                var nickname = result[0].nickname;

                var emailTemplete = "안녕하세요<br/>";
                emailTemplete += "신청하신 id의 승인이 취소 되었습니다. <br/>";
                emailTemplete += "id : " + uid + "<br/>";
                emailTemplete += "email : " + email + "<br/>";
                emailTemplete += "nickname : " + nickname + "<br/>";                
                emailTemplete += "<a href=':hostAddress' target='_blank'>사이트로 이동</a>";

                mysql.query(sql, params, function (err, result, fields) {
                    if(err) util.log('query is not excuted.\n' + err);
                    else {                        
                        if (email != "" && type == 0) {
                            util.emailSender(email, "[usaki.co.kr 승인이 취소되었습니다.]", emailTemplete);
                        }

                        res.json("SUCCESS");
                    }
                });                                                          
            }
        }
    });               
} 

exports.post_confirm_eject = (req, res) => {
    util.log(req.body);

    var seq = req.body.seq;    

    var sql = "delete from user_table where seq = ?";    
    var params = [seq];            
    
    var sqlUser = "SELECT * FROM user_table WHERE seq = ? ";
    var params2 = [seq];            
        
    var mysql = util.mysqlConnecter();
    mysql.query(sqlUser, params2, function (err, result, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            if (result[0].seq == seq) {
                var uid = result[0].uid;
                var email = result[0].email;
                var nickname = result[0].nickname;

                var emailTemplete = "안녕하세요<br/>";
                emailTemplete += "신청하신 id의 승인이 거부 되었습니다. <br/>";
                emailTemplete += "id : " + uid + "<br/>";
                emailTemplete += "email : " + email + "<br/>";
                emailTemplete += "nickname : " + nickname + "<br/>";                
                emailTemplete += "<a href=':hostAddress' target='_blank'>사이트로 이동</a>";
                util.log(emailTemplete);

                mysql.query(sql, params, function (err, result, fields) {
                    if(err) util.log('query is not excuted.\n' + err);
                    else {                        
                        if (email != "") {
                            util.emailSender(email, "[usaki.co.kr 승인이 거부 되었습니다.]", emailTemplete);
                        }

                        res.json("SUCCESS");
                    }
                });                                                          
            }
        }
    });                 
}


exports.post_confirm_del = (req, res) => {
    util.log(req.body);

    var seq = req.body.seq;    

    var sql = "delete from user_table where seq = ?";    
    var params = [seq];            
    
    var sqlUser = "SELECT * FROM user_table WHERE seq = ? ";
    var params2 = [seq];            
    
    var mysql = util.mysqlConnecter();
    mysql.query(sqlUser, params2, function (err, result, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            if (result[0].seq == seq) {
                var uid = result[0].uid;
                var email = result[0].email;
                var nickname = result[0].nickname;

                var emailTemplete = "안녕하세요<br/>";
                emailTemplete += "해당 id는 삭제 되었습니다. <br/>";
                emailTemplete += "id : " + uid + "<br/>";
                emailTemplete += "email : " + email + "<br/>";
                emailTemplete += "nickname : " + nickname + "<br/>";                
                emailTemplete += "<a href=':hostAddress' target='_blank'>사이트로 이동</a>";
                util.log(emailTemplete);

                mysql.query(sql, params, function (err, result, fields) {
                    if(err) util.log('query is not excuted.\n' + err);
                    else {                        
                        if (email != "") {
                            //util.emailSender(email, "[usaki.co.kr 계정이 삭제 되었습니다.]", emailTemplete);
                        }

                        res.json("SUCCESS");
                    }
                });                                                          
            }
        }
    });                  
}

exports.get_confirm_write = ( req , res) => {

    var sql = "select * from card_info ORDER BY cardlevel DESC, cardname";

    var mysql = util.mysqlConnecter();
    mysql.query(sql, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            res.render( './admin/write' , 
            { 
                list:rows,
                title: "카드 정보 관리",
                bodyId: req.url        
            }
        ); 
        }
    });                
}

exports.get_user_stat = ( req , res) => {

    var sql = "SELECT uid, nickname, last_login, SUM(CASE WHEN ym = ? THEN cnt ELSE 0 END) AS tot_ym, SUM(cnt) AS tot ";
    sql += "FROM ( ";
    sql += "SELECT a.uid, MIN(a.nickname) AS nickname, DATE_FORMAT(MIN(a.last_login), '%Y%m%d %r') AS last_login, b.user_ip, DATE_FORMAT(b.cre_date, '%Y%m') AS ym, COUNT(*) AS cnt ";
    sql += "FROM user_table a INNER JOIN user_login_info b ON a.seq = b.seq_fk ";
    sql += "WHERE uid <> 'choiyw2' GROUP BY a.uid, b.user_ip, DATE_FORMAT(b.cre_date, '%Y%m') ";
    sql += ") a GROUP BY uid, nickname, last_login ";    

    var sqlTot = "SELECT ymd, cnt, (SELECT SUM(cnt) FROM access_log WHERE SUBSTR(ymd, 1, 6) = SUBSTR(a.ymd, 1,6)) AS m_cnt FROM access_log a WHERE ymd = DATE_FORMAT(NOW(), '%Y%m%d')";

    var newDate = new Date();
    var nowYm = newDate.toFormat("YYYYMM");    
    var params;
    var totMsg = "";

    console.log(req.body);

    if (req.body.ddlYm != null) {
        params = [req.body.ddlYm];
    } else {
        params = [nowYm];
    }

    var mysql = util.mysqlConnecter();
    mysql.query(sqlTot, function (err, result, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            if (result[0] != null) {
                totMsg = result[0].ymd + " - 당일 접속수 : ("+result[0].cnt+"), 월 접속수 : ("+result[0].m_cnt+")";   
            }
        }
    });                
        
    mysql.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            res.render( './admin/userstat' , 
            { 
                list:rows,
                nowYm:nowYm,
                todayMsg:totMsg,
                title: "회원 접속 통계",
                bodyId: req.url        
            }
        ); 
        }
    });                
}

exports.post_user_stat = ( req , res) => {

    var sql = "SELECT uid, nickname, last_login, SUM(CASE WHEN ym = ? THEN cnt ELSE 0 END) AS tot_ym, SUM(cnt) AS tot ";
    sql += "FROM ( ";
    sql += "SELECT a.uid, MIN(a.nickname) AS nickname, DATE_FORMAT(MIN(a.last_login), '%Y%m%d %r') AS last_login, b.user_ip, DATE_FORMAT(b.cre_date, '%Y%m') AS ym, COUNT(*) AS cnt ";
    sql += "FROM user_table a INNER JOIN user_login_info b ON a.seq = b.seq_fk ";
    sql += "WHERE uid <> 'choiyw2' GROUP BY a.uid, b.user_ip, DATE_FORMAT(b.cre_date, '%Y%m') ";
    sql += ") a GROUP BY uid, nickname, last_login ";    

    var sqlTot = "SELECT ymd, cnt, (SELECT SUM(cnt) FROM access_log WHERE SUBSTR(ymd, 1, 6) = SUBSTR(a.ymd, 1,6)) AS m_cnt FROM access_log a WHERE ymd = DATE_FORMAT(NOW(), '%Y%m%d')";

    var newDate = new Date();
    var nowYm = newDate.toFormat("YYYYMM");    
    var params;    
    var totMsg = "";

    console.log(req.body);

    if (req.body.ddlYm != null) {
        params = [req.body.ddlYm];
    } else {
        params = [nowYm];
    }

    var mysql = util.mysqlConnecter();
    mysql.query(sqlTot, function (err, result, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            if (result[0] != null) {
                totMsg = result[0].ymd + " - 당일 접속수 : ("+result[0].cnt+"), 월 접속수 : ("+result[0].m_cnt+")";   
            }
        }
    });                
        
    mysql.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            res.render( './admin/userstat' , 
            { 
                list:rows,
                nowYm:req.body.ddlYm,
                todayMsg:totMsg,
                title: "회원 접속 통계",
                bodyId: req.url        
            }
        ); 
        }
    });                
}

exports.post_card_view = ( req , res ) => {
    var seq = req.body.seq;
    var sql = "SELECT * FROM card_info WHERE seq = :seq ";
    sql = sql.replace(":seq", seq);        
    
    var mysql = util.mysqlConnecter();
    mysql.query(sql, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            res.json(rows);
            //console.log(rows);
        }
    });              
} 

exports.post_card_insert = ( req , res ) => {

    util.log(req.body);                    

    var sql = "INSERT INTO card_info (`cardname`, `cardlevel`, `cardtype`, `cardrace`, `cardactpower`, `cardactive1`, `cardactive1_waiting`, `cardactive2`, `cardactive2_waiting`, `maineffect`) VALUES ";
    sql += "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";    
    var params = [req.body.name, req.body.level, req.body.type, req.body.race, req.body.actpower, req.body.active1, req.body.active1_cooltime, req.body.active2, req.body.active2_cooltime, req.body.effect];
        
    var mysql = util.mysqlConnecter();
    mysql.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted.\n' + err);
        else {
            res.redirect("./write");
        }
    });                                                              
} 

exports.post_card_update = ( req , res ) => {
    util.log(req.body);                    

    var sql = "update card_info set maineffect = ? where cardname = ? ";    
    var params = [req.body.effect, req.body.name];
        
    var mysql = util.mysqlConnecter();
    mysql.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted.\n' + err);
        else {
            res.redirect("./write");
        }
    });      
} 


exports.post_card_delete = ( req , res ) => {
    util.log(req.body);                    

    var sql = "delete from card_info where cardname = ? ";    
    var params = [req.body.name];
        
    var mysql = util.mysqlConnecter();
    mysql.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted.\n' + err);
        else {
            res.redirect("./write");
        }
    });          
} 


exports.get_log_list = (req, res) => {
        
    var files = util.readFolder("logs");
        
    res.render( './admin/loglist' , 
    { 
        list:files,
        title: "로그 리스트",
        bodyId: req.url        
    }
    )
}

exports.post_log_del = (req, res) => {
    var fs = require('fs');
    var os = require('os');
    const appRoot = require('app-root-path');

    util.log(req.body);
    util.delDirAll(req.body.url);

    res.json("SUCCESS");
}

exports.post_log_del_each = (req, res) => {
    var fs = require('fs');
    var os = require('os');
    const appRoot = require('app-root-path');

    util.log(req.body);
    util.delFile(req.body.url, req.body.filename);

    res.json("SUCCESS");
}

