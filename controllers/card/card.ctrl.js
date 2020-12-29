const db_config = require('../../conf/db.js');
//console.log(db_config.init);
var conn = db_config.init();
db_config.connect(conn);

exports.get_card_list = (req , res) => {        
    var lvl = req.body.lvl;
    var sql = "SELECT * FROM card_info WHERE cardlevel = ':lvl' ORDER BY cardname";        
    sql = sql.replace(":lvl", lvl);        
    
    console.log(sql);

    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
        else {            
            res.json(rows);
            //console.log(rows);
        }
    });    
}

exports.get_card_view = ( req , res) => {
    var seq = req.body.seq;
    var sql = "SELECT * FROM card_info WHERE seq = :seq ";
    sql = sql.replace(":seq", seq);        
    
    console.log(sql);

    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail\n' + err);
        else {            
            res.json(rows);
            console.log(rows);
        }
    });  
}

exports.post_card_write = ( req , res ) => {
    res.send(req.body);
    console.log(req.body);
} 