const app = require('./app.js');
const port = process.env.port || 8001

// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs')
// app.get('/', (req, res) => {
//   res.render('index')
// })

const server = app.listen( port, function(){
    console.log('Express listening on port', port);
}); 

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