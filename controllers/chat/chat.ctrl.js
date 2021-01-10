
exports.get_index = ( req , res) => {    

    console.log(gSocket);

    res.render( './chat' , 
        { message : "hello",
        online : "express",
        title: "채팅",
        bodyId: req.url        
        } // message 란 변수를 템플릿으로 내보낸다.
    );
}