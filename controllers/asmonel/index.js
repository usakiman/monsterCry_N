const { Router } = require('express');
const router = Router();
const ctrl = require('./asmonel.ctrl');

function getMiddleWare( req, res, next ){
    if (!(req.session.loginType == 2 || req.session.loginType == 3 || req.session.loginType == 4)) {
        res.redirect("./");
    }
    next();
}

function postMiddleWare( req, res, next ){
    if (!(req.session.loginType == 2 || req.session.loginType == 3 || req.session.loginType == 4)) {
        res.json("권한이 없습니다.");
    }
    next();
}

router.get('/', getMiddleWare, ctrl.get_index );


module.exports = router;

