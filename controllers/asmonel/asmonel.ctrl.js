const util = require("../util");

exports.get_index = ( req , res) => {    
    res.render( './asmonel' , 
        { 
            message : "hello",
            online : "express",
            title: "관리자 리스트",
            bodyId: req.url        
        } // message 란 변수를 템플릿으로 내보낸다.
    );
}
