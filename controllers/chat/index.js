const { Router } = require('express');
const router = Router();
const ctrl = require('./chat.ctrl');

function getMiddleWare( req, res, next ){
    if (!(req.session.loginType == 3 || req.session.loginType == 4)) {        
        //res.redirect("/");
    }   
    next(); 
}

router.get('/', getMiddleWare, ctrl.get_index );

module.exports = router;