const app = require('./app.js');
const port = process.env.port || 8001


// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs')
// app.get('/', (req, res) => {
//   res.render('index')
// })

app.listen( port, function(){
    console.log('Express listening on port', port);
}); 