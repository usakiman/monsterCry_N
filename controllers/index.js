const { Router } = require('express');
const router = Router();

let util = require("./util");

const itemList = require("../conf/item_info");
 
router.use('/admin', require('./admin'));
router.use('/card', require('./card'));

router.get('/', (req, res) => {
    const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    var errSql = "select count(*) from user_table";
    var sql = "SELECT * FROM card_info WHERE maineffect <> '' and cardlevel = 'SSS+' ORDER BY cardlevel desc, cardname";
    var sqlInsert = "insert into access_list (user_ip, cre_date, code) values (?, now(), ?)";
    var sqlMerge = "INSERT INTO access_log (ymd, cnt) VALUES (DATE_FORMAT( NOW(), '%Y%m%d'), 1) ON DUPLICATE KEY UPDATE cnt = cnt + 1";
    var params = [ip, ""];

    //console.log(req.session);
    //req.session.isLogin = true;
    //req.session.loginID = "test";
    //console.log(req.session.loginID);  
    
    console.log("index.js : " + util.mySqlConn.state);
    if (util.mySqlConn.state === "disconnected") {
        util.mySqlConn.end();
        this.util = require("./util");
        console.log("util require again");
    }

    try {
        util.mySqlConn.query(errSql, function (err, result, fields) {
            if(err) {
                console.log('메인 커넥션 에러\n' + err);
                var t = util.mysqlInit();
                util.mySqlConn.end();
                util.mysqlconn = t.conn;

                util.emailSender("choiyw2@gmail.com", "[usaki.co.kr] mysql 커넥션 오류 발생 하여 복구 했습니다.", "<div>"+err+"</div>");
            }
            else {             
                console.log('메인 커넥션 성공\n');
            }
        });
    } catch (err) {
        util.mysqlInit();
        util.emailSender("choiyw2@gmail.com", "[usaki.co.kr] 오류 발생 하여 복구 했습니다.", "<div>"+err+"</div>");
    } finally {
        util.mySqlConn.query(sql, function (err, rows, fields) {
            if(err) {
                console.log('query is not excuted.\n' + err);
            }
            else {             
                res.render('index', {
                    eList : rows,
                    itemList : itemList,            
                    path: req.url,
                    isLogin : req.session.isLogin,
                    loginID : req.session.loginID,
                    loginType : req.session.loginType,
                    link : req.session.link
                });                        
            }
        });
    }

    util.mySqlConn.query(sqlInsert, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted.\n' + err);
        else {
            console.log("insert execute --> accessID = "+rows.insertId + " ,IP =" + ip);
        }
    });

    util.mySqlConn.query(sqlMerge, function(err, rows, fields) {
        if (err) console.log('query is not excuted.\n' + err);
        else {
            console.log("access merge execute");
        }
    });    
})

router.get('/hello', function(req,res){

    req.session.destroy();
    res.redirect("/hello/1234");

    res.render('index', {
        name:req.query.nameQuery,
        tList : null,
        isLogin : req.session.isLogin,
        loginID : req.session.loginID
    });
    console.log(req.session.loginID);
});

router.get('/hello/:nameParam', function(req,res){
    res.render('index', {
        name:req.params.nameParam,
        tList : null,
        isLogin : req.session.isLogin,
        loginID : req.session.loginID
    });
    console.log(req.session.loginID);
});

module.exports = router; 