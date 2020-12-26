const { Router } = require('express');
const router = Router();

const db_config = require('../conf/db.js');
console.log(db_config.init);
var conn = db_config.init();
db_config.connect(conn);

router.use('/admin', require('./admin'));

// router.get('/', (req,res) => {
//     res.send('express start');
//     console.log("main");
// });

router.get('/', (req, res) => {
    var sql = 'SELECT * FROM table1';

    console.log(req.session);
    req.session.isLogin = true;
    req.session.loginID = "test";
    console.log(req.session.loginID);

    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('index', {
            tList : rows,
            name: req.url,
            isLogin : req.session.isLogin,
            loginID : req.session.loginID
        });
    });

    
    
    // res.render('index', {
    //     name: req.url
    // })
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