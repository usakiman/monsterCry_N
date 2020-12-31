const { Router } = require('express');
const router = Router();

const db_config = require('../conf/db.js');
// console.log(db_config.init);
var conn = db_config.init();
db_config.connect(conn);

const itemList = require("../conf/item_info");
 
router.use('/admin', require('./admin'));
router.use('/card', require('./card'));

router.get('/', (req, res) => {
    const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    var sql = "SELECT * FROM card_info WHERE maineffect <> '' ORDER BY cardlevel desc, cardname";
    var sqlInsert = "insert into access_list (user_ip, cre_date, code) values (?, now(), ?)";
    var sqlMerge = "INSERT INTO access_log (ymd, cnt) VALUES (DATE_FORMAT( NOW(), '%Y%m%d'), 1) ON DUPLICATE KEY UPDATE cnt = cnt + 1";
    var params = [ip, ""];

    //console.log(req.session);
    //req.session.isLogin = true;
    //req.session.loginID = "test";
    //console.log(req.session.loginID);

    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted.\n' + err);
        else { 
            console.log(itemList);
            res.render('index', {
                eList : rows,
                itemList : itemList,            
                path: req.url,
                isLogin : req.session.isLogin,
                loginID : req.session.loginID            
            });                        
        }
    });

    conn.query(sqlInsert, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted.\n' + err);
        else {
            console.log("insert execute --> accessID = "+rows.insertId);
        }
    });

    conn.query(sqlMerge, function(err, rows, fields) {
        if (err) console.log('query is not excuted.\n' + err);
        else {
            console.log("merge execute");
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