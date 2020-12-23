// const express = require("express");
// const router = express.Router();


// function testMiddleWare( req, res, next) {
//     console.log("first middleware");
//     next();
// }

// function testMiddleWare2( req, res, next) {
//     console.log("second middleware");
//     next();
// }

// function loginRequire( req, res, next) {
    
// }

// router.get("/", testMiddleWare, testMiddleWare2, (req, res) => {
//     res.send("admin 이후 url");
// });

// router.get("/products", testMiddleWare, function (_, res) {    
//     //res.send("admin products");
//     res.render( "admin/products.html", {
//             messages : "<h1>태그 출력</h1>",
//             online : "express"
//     });
// });

// router.get("/products/write", function (req, res) {
//     res.render("admin/write.html");
// });


// router.post("/products/write", (req, res) => {
//     res.send(req.body);
//     //res.send(req.body.price);
//     //res.send(req.body.description);
// });


// module.exports = router;