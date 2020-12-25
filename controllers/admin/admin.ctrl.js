exports.get_products = ( req , res) => {
    res.render( './admin/products' , 
        { message : "hello",
        online : "express",
        title: "관리자 리스트",
        bodyId: req.url        
        } // message 란 변수를 템플릿으로 내보낸다.
    );
}

exports.get_products_write = ( req , res) => {
    res.render( './admin/write',  {
        message : "hello",
        title: "관리자 리스트",
        img1 : "/files/레가드리스.jpg",
        img1_title : "레가드리스"
    });
}

exports.post_products_write = ( req , res ) => {
    res.send(req.body);
    console.log(req.body);
} 