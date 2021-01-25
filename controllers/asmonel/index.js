const { Router } = require('express');
const router = Router();
const ctrl = require('./asmonel.ctrl');

function getMiddleWare( req, res, next ){
    if (req.session.loginType == undefined) {
        res.redirect("/");        
    } else {
        if (!(req.session.loginType == 2 || req.session.loginType == 3 || req.session.loginType == 4)) {
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
        if (!(req.session.loginType == 2 || req.session.loginType == 3 || req.session.loginType == 4)) {
            res.json("권한이 없습니다.");
        } else {
            next();
        }
    }
}

router.get('/', getMiddleWare, ctrl.get_index );
router.get('/stat', getMiddleWare, ctrl.get_stat );

router.post('/save', postMiddleWare, ctrl.set_save );
router.post('/saveChk', postMiddleWare, ctrl.set_saveChk );
router.post('/update', postMiddleWare, ctrl.set_update );


module.exports = router;

