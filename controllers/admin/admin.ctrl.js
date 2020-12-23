exports.get_products = ( _ , res) => {
    res.render( 'admin/products.html' , 
        { message : "hello",
        online : "express" 
        } // message 란 변수를 템플릿으로 내보낸다.
    );
}

exports.get_products_write = ( _ , res) => {
    res.render( 'admin/write.html',  {
        message : "hello",
        img1 : "/files/레가드리스.jpg",
        img1_title : "레가드리스"
    });
}

exports.post_products_write = ( req , res ) => {
    res.send(req.body);
    console.log(req.body);
} 