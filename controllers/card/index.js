const { Router } = require('express');
const router = Router();
const ctrl = require('./card.ctrl');
const util = require("../util");
const { request } = require('../../app');

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

function postMiddleWareAllUser( req, res, next ){    
    if (req.session.loginType == undefined) {
        res.json("권한이 없습니다.");
    } else {
        if (!(req.session.loginType == 1 || req.session.loginType == 2 || req.session.loginType == 3 || req.session.loginType == 4)) {
            res.json("권한이 없습니다.");
        } else {
            next();
        }
    }
}

const getMiddleWareJwt = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies['access_token'];    
    if (token != undefined) {
        try {
            const decoded = util.decodeToken(token);

            if (Date.now() / 1000 - decoded.iat > 60 * 60 *24) {
                const { _id, profile } = decoded;
                const freshToken = util.generateToken({ username : 'usaki'});
                res.cookie('access_token', freshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7}); 
            }

            req.user = decoded;
        } catch (e) {
            req.user = null;
        }
    }

    next();
}


router.get('/', getMiddleWare , (req,res) => {
    res.send('까꿍~? how are you?');
});

router.post('/list', postMiddleWareAllUser, ctrl.post_card_list );
router.post('/view', postMiddleWareAllUser, ctrl.post_card_view );
router.post('/exist_img', postMiddleWareAllUser, ctrl.post_img_exist );

router.post("/actResult", postMiddleWareAllUser, ctrl.post_card_result);

router.post("/login", ctrl.post_card_login);
router.post("/logout", ctrl.post_card_logout);
router.post("/join", ctrl.post_card_join);

router.post('/write', postMiddleWare, ctrl.post_card_write );


// react관련

router.get("/login_auth", ctrl.get_login_auth);
router.get("/logout_auth", ctrl.get_logout_auth);
router.get("/auth_check", getMiddleWareJwt, ctrl.get_auth_check);

module.exports = router;

