const { Router } = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');

function getMiddleWare( req, res, next ){
    if (!(req.session.loginType == 3 || req.session.loginType == 4)) {
        res.redirect("./");
    }
    next();
}

function postMiddleWare( req, res, next ){
    if (!(req.session.loginType == 3 || req.session.loginType == 4)) {
        res.json("권한이 없습니다.");
    }
    next();
}

function getMiddleWareRoot( req, res, next ){
    if (!(req.session.loginType == 4)) {        
        res.redirect("./confirm");
    }
    next();
}

function postMiddleWareRoot( req, res, next ){
    if (!(req.session.loginType == 4)) {
        res.json("권한이 없습니다.");
    }
    next();
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
router.get('/userlist', getMiddleWare, ctrl.get_userlist);

router.get('/write', getMiddleWareRoot, ctrl.get_confirm_write );

router.post("/cardinsert", postMiddleWareRoot, ctrl.post_card_insert);
router.post("/cardupdate", postMiddleWareRoot, ctrl.post_card_update);
router.post("/carddelete", postMiddleWareRoot, ctrl.post_card_delete);

module.exports = router;

