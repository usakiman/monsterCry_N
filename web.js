const app = require('./app.js');
const port = process.env.port || 8001

// const jwt = require("jsonwebtoken");
// const token = jwt.sign(
//     { foo: 'bar'}, 'secket-key', {expiresIn: '7d'}, (err, token) => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         console.log(token);
//     }
// )

let util = require("./controllers/util");
gMysqlConn = util.mysqlConnecter();

process.setMaxListeners(20);

const server = app.listen( port, function(){
    console.log('Express listening on port', port);
}); 

// 인터벌 쿼리 30분마다 (커넥션 안끊기게 하기 위해.)
let tID = setInterval(() => {
    util.intervalSelect();
}, (1000*60)*30);

const listen = require("socket.io");
const io = listen(server);

gSocketCount = 0;
io.on('connection', (socket) => { 
    const username = gLoginID;
        
    gSocketCount = gSocketCount + 1;    
    io.emit('users.count',gSocketCount);

    socket.broadcast.emit('join',  
        {  
            username : username,
            cnt : gSocketCount  
        }        
    );

    socket.on('client message', (data) => {
        io.emit('server message', {
            username : username ,
            message : data.message
        });
    });

    //socket.on('connect', function() { connectCounter++; });
    //socket.on('disconnect', function() { connectCounter--; });
    
    socket.on('disconnect', () => {        
        gSocketCount = gSocketCount - 1;        
        socket.broadcast.emit('leave', { 
            username : username,
            cnt : gSocketCount }
        );
        
        //io.emit('users.count',gSocketCount);        
    });
});

gSocket = io;