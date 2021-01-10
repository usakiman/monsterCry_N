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

const color = [
    "yellow",
    "green",
    "red",
    "blue",
    "white",
    "black",
]

io.on('connection', (socket) => { 

    const username = color[ Math.floor(Math.random() * 6) ];

    socket.broadcast.emit( 'join',  {  username  } );

    socket.on('client message', (data) => {
        io.emit('server message', {
            username ,
            message : data.message
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { username });
    });
});

gSocket = io;