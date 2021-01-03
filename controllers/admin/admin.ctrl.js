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
    console.log(req.body);
} 

exports.get_confirm = ( req , res) => {
        
    var sql = "SELECT * FROM user_table WHERE STATUS = 0 order by seq desc";    
    util.mySqlConn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
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
    var sql = "SELECT a.*, CASE STATUS WHEN 0 THEN '승인전' WHEN 1 THEN '외부' WHEN 2 THEN '몬주' WHEN 3 THEN '관리자' END AS statusHan FROM user_table a WHERE a.STATUS > 0 and a.STATUS < 4 order by a.seq desc";
    util.mySqlConn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
        else {            
            res.render( './admin/userlist' , 
            { 
                list:rows,
                title: "관리자 메뉴",
                bodyId: req.url        
            }
        ); 
        }
    });        
}

exports.post_confirm = ( req , res ) => {

    console.log(req.body);

    var seq = req.body.seq;
    var type = req.body.type;
    var rWord = util.randomWord().substr(0, 6);

    var sql = "UPDATE user_table SET STATUS = ?, loginCode = ? WHERE seq = ?";    
    var params = [type, rWord, seq];            
    
    var sqlUser = "SELECT * FROM user_table WHERE seq = ? ";
    var params2 = [seq];            
        
    util.mySqlConn.query(sqlUser, params2, function (err, result, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
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

                util.mySqlConn.query(sql, params, function (err, result, fields) {
                    if(err) console.log('query is not excuted.\n' + err);
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

    console.log(req.body);

    var seq = req.body.seq;
    var type = req.body.type;    

    var sql = "UPDATE user_table SET STATUS = ? WHERE seq = ?";    
    var params = [type, seq];            
    
    var sqlUser = "SELECT * FROM user_table WHERE seq = ? ";
    var params2 = [seq];            
        
    util.mySqlConn.query(sqlUser, params2, function (err, result, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
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

                util.mySqlConn.query(sql, params, function (err, result, fields) {
                    if(err) console.log('query is not excuted.\n' + err);
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
    console.log(req.body);

    var seq = req.body.seq;    

    var sql = "delete from user_table where seq = ?";    
    var params = [seq];            
    
    var sqlUser = "SELECT * FROM user_table WHERE seq = ? ";
    var params2 = [seq];            
        
    util.mySqlConn.query(sqlUser, params2, function (err, result, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
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
                console.log(emailTemplete);

                util.mySqlConn.query(sql, params, function (err, result, fields) {
                    if(err) console.log('query is not excuted.\n' + err);
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
    console.log(req.body);

    var seq = req.body.seq;    

    var sql = "delete from user_table where seq = ?";    
    var params = [seq];            
    
    var sqlUser = "SELECT * FROM user_table WHERE seq = ? ";
    var params2 = [seq];            
        
    util.mySqlConn.query(sqlUser, params2, function (err, result, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
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
                console.log(emailTemplete);

                util.mySqlConn.query(sql, params, function (err, result, fields) {
                    if(err) console.log('query is not excuted.\n' + err);
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
    util.mySqlConn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
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

exports.post_card_view = ( req , res ) => {
    var seq = req.body.seq;
    var sql = "SELECT * FROM card_info WHERE seq = :seq ";
    sql = sql.replace(":seq", seq);        
    
    util.mySqlConn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
        else {            
            res.json(rows);
            //console.log(rows);
        }
    });          
} 

exports.post_card_insert = ( req , res ) => {

    console.log(req.body);                    

    var sql = "INSERT INTO card_info (`cardname`, `cardlevel`, `cardtype`, `cardrace`, `cardactpower`, `cardactive1`, `cardactive1_waiting`, `cardactive2`, `cardactive2_waiting`, `maineffect`) VALUES ";
    sql += "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";    
    var params = [req.body.name, req.body.level, req.body.type, req.body.race, req.body.actpower, req.body.active1, req.body.active1_cooltime, req.body.active2, req.body.active2_cooltime, req.body.effect];
        
    util.mySqlConn.query(sql, params, function (err, rows, fields) {
        if(err) console.log('query is not excuted.\n' + err);
        else {
            res.redirect("./write");
        }
    });                                                          
    
} 

exports.post_card_update = ( req , res ) => {
    console.log(req.body);                    

    var sql = "update card_info set maineffect = ? where cardname = ? ";    
    var params = [req.body.effect, req.body.name];
        
    util.mySqlConn.query(sql, params, function (err, rows, fields) {
        if(err) console.log('query is not excuted.\n' + err);
        else {
            res.redirect("./write");
        }
    });                                                                      
} 


exports.post_card_delete = ( req , res ) => {
    console.log(req.body);                    

    var sql = "delete from card_info where cardname = ? ";    
    var params = [req.body.name];
        
    util.mySqlConn.query(sql, params, function (err, rows, fields) {
        if(err) console.log('query is not excuted.\n' + err);
        else {
            res.redirect("./write");
        }
    });                                                                      
} 