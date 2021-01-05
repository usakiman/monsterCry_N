const { Router } = require('express');
const router = Router();
const ctrl = require('./card.ctrl');

function testMiddleWare( req, res, next ){    
    next();
}

function testMiddleWare2( req, res, next ){    
    next();
}

router.get('/', testMiddleWare, testMiddleWare2 , (req,res) => {
    res.send('card app');
});

router.post('/list', ctrl.post_card_list );
router.post('/view', ctrl.post_card_view );

router.post("/actResult", ctrl.post_card_result);

router.post("/login", ctrl.post_card_login);
router.post("/logout", ctrl.post_card_logout);
router.post("/join", ctrl.post_card_join);

router.post('/write', ctrl.post_card_write );

module.exports = router;

