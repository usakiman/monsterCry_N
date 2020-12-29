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

router.post('/list', ctrl.get_card_list );

router.post('/view', ctrl.get_card_view );

router.post('/write', ctrl.post_card_write );

module.exports = router;

