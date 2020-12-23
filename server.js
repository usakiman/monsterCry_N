const app = require('./app.js');
const port = process.env.port || 3000

app.listen( port, function(){
    console.log('Express listening on port', port);
}); 