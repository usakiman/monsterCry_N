
exports.get_index = ( req , res) => {    

    //console.log(gSocket);
    //console.log(gSocket.sockets.clients().length);    
                
    // gSocket.on('connection', (socket) => { 

    //     const username = req.session.loginID;
    
    //     socket.broadcast.emit( 'join',  {  username  } );
    
    //     socket.on('client message', (data) => {
    //         gSocket.emit('server message', {
    //             username : username ,
    //             message : data.message
    //         });
    //     });
    
    //     socket.on('disconnect', () => {
    //         socket.broadcast.emit('leave', { username });
    //     });
    // });
    
    res.render( './chat' , 
        { 
            chatID : req.session.loginID,
            socketCnt : gSocketCount,
            title: "채팅",
            bodyId: req.url        
        } // message 란 변수를 템플릿으로 내보낸다.
    );
}