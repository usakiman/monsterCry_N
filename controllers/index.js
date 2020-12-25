const { Router } = require('express');
const router = Router()

router.use('/admin', require('./admin'));

// router.get('/', (req,res) => {
//     res.send('express start');
//     console.log("main");
// });

router.get('/', (req, res) => {
    res.render('index', {
        name: req.url
    })
})

router.get('/hello', function(req,res){
    res.render('index', {name:req.query.nameQuery});
});

router.get('/hello/:nameParam', function(req,res){
    res.render('index', {name:req.params.nameParam});
});

module.exports = router; 