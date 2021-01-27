const { Router } = require('express');
const router = Router();
const ctrl = require('./battle.ctrl');

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
router.get('/cardmake', getMiddleWare, ctrl.get_CardMake );
router.get('/skill', getMiddleWare, ctrl.get_Skill );
router.get('/simul', getMiddleWare, ctrl.get_Simul );

router.post('/cardmake_save', postMiddleWare, ctrl.set_CardMake_Save );
router.post('/cardmake_delete', postMiddleWare, ctrl.set_CardMake_Delete );
router.post('/skill_save', postMiddleWare, ctrl.set_Skill_Save );

// ctrl.js 안에서 대소문자 체크함 render중 (cafe24)

// router.get('/stat', getMiddleWare, ctrl.get_stat );

// router.post('/save', postMiddleWare, ctrl.set_save );
// router.post('/saveChk', postMiddleWare, ctrl.set_saveChk );
// router.post('/update', postMiddleWare, ctrl.set_update );


module.exports = router;

