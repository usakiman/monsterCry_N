const { Router } = require('express');
const router = Router()

router.use('/admin', require('./admin'));

router.get('/', (req,res) => {
    res.send('express start');
    console.log("main");
});

module.exports = router; 