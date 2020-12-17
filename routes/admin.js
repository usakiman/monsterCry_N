const express = require("express");
const router = express.Router();


function testMiddleWare( req, res, next) {
    console.log("first middleware");
    next();
}

function testMiddleWare2( req, res, next) {
    console.log("second middleware");
    next();
}

router.get("/", testMiddleWare, testMiddleWare2, (req, res) => {
    res.send("admin 이후 url");
});

router.get("/products", (req, res) => {    
    //res.send("admin products");
    res.render( "admin/products.html", {
            messages : "<h1>태그 출력</h1>",
            online : "express"
    });
});

router.get("/products/write", (req, res) => {
    res.render("admin/write.html", {
        message : "hello",
        img1 : "/files/레가드리스.jpg",
        img1_title : "레가드리스"
    })
});

router.post("/products/write", function (req, res) {
    res.send(req.body);
    console.log(req.body);
});

module.exports = router;