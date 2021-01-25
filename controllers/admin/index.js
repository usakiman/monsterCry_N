const { Router } = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');

function getMiddleWare( req, res, next ){
    if (req.session.loginType == undefined) {
        res.redirect("/");
    } else {
        if (!(req.session.loginType == 3 || req.session.loginType == 4)) {
            res.redirect("/");
        } else {
            next();
        }
    }                
}

function postMiddleWare( req, res, next ){
    if (req.session.loginType == undefined) {
        res.json("권한이 없습니다.");
    } else {
        if (!(req.session.loginType == 3 || req.session.loginType == 4)) {
            res.json("권한이 없습니다.");
        } else {
            next();
        }
    }                
}

function getMiddleWareRoot( req, res, next ){
    if (req.session.loginType == undefined) {
        res.redirect("./confirm");
    } else {
        if (!(req.session.loginType == 4)) {
            res.redirect("./confirm");
        } else {
            next();
        }
    }                    
}

function postMiddleWareRoot( req, res, next ){
    if (req.session.loginType == undefined) {
        res.json("권한이 없습니다.");
    } else {
        if (!(req.session.loginType == 4)) {
            res.json("권한이 없습니다.");
        } else {
            next();
        }
    }                        
}

router.get('/', (req,res) => {
    res.send('권한이 없습니다. 접근하실수 없습니다!!!');
});

router.get('/products', getMiddleWare, ctrl.get_products );
router.post('/products/write', postMiddleWare, ctrl.post_products_write );

router.get('/confirm', getMiddleWare, ctrl.get_confirm );
router.post('/confirm_process', postMiddleWare, ctrl.post_confirm );
router.post('/confirm_change_process', postMiddleWare, ctrl.post_confirm_change );
router.post('/confirm_eject', postMiddleWare, ctrl.post_confirm_eject );
router.post('/confirm_del', postMiddleWare, ctrl.post_confirm_del );
router.post('/pwd_init', postMiddleWare, ctrl.post_pwd_init);


router.get('/userlist', getMiddleWare, ctrl.get_userlist);
router.get('/userlist/:noParam', getMiddleWare, ctrl.get_userlist);

router.get('/write', getMiddleWareRoot, ctrl.get_confirm_write );

router.post("/cardinsert", postMiddleWareRoot, ctrl.post_card_insert);
router.post("/cardupdate", postMiddleWareRoot, ctrl.post_card_update);
router.post("/carddelete", postMiddleWareRoot, ctrl.post_card_delete);

router.post("/cardview", postMiddleWareRoot, ctrl.post_card_view);

router.get("/loglist", getMiddleWareRoot, ctrl.get_log_list);
router.post("/log_del", postMiddleWareRoot, ctrl.post_log_del);
router.post("/log_del_each", postMiddleWareRoot, ctrl.post_log_del_each);

router.get("/userstat", getMiddleWare, ctrl.get_user_stat);
router.post("/userstat", getMiddleWare, ctrl.post_user_stat);

module.exports = router;

