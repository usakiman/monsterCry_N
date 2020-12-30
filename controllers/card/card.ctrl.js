const { json } = require('express');
const db_config = require('../../conf/db.js');
//console.log(db_config.init);
var conn = db_config.init();
db_config.connect(conn);

exports.post_card_list = (req , res) => {        
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

exports.post_card_view = ( req , res) => {
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

exports.post_card_result = (req, res) => {
    // "actPower" : $("#hidActPower").val(),
    // "skill1_w" : $("#hidActSkill1_w").val(),
    // "skill2_2" : $("#hidActSkill2_w").val(),
    // "attSpeed" : vAttSpeed,
    // "skillSpeed" : vSkillSpeed   

    console.log(req.body);

    var returnActPower = 0.0;
    var returnSkill1_Wtime = 0.0;
    var returnSkill2_Wtime = 0.0;
    var returnSkill1_chance = 0;
    var returnSkill2_chance = 0;
    var tempData = 0.0;

    // 공속
    tempdata = parseFloat(req.body.attSpeed) + 100;
    
    // 행동력
    returnActPower = (parseFloat(req.body.actPower) / tempdata) * 100;
    returnActPower = returnActPower.toPrecision(4);
    
    // 스속
    tempdata = parseFloat(req.body.skillSpeed) + 100;

    // 스킬 1 쿨타임    
    returnSkill1_Wtime = (parseFloat(req.body.skill1_w) / tempdata) * 100;    
    returnSkill1_Wtime = returnSkill1_Wtime.toPrecision(4);    

    // 스킬 2 쿨타임
    returnSkill2_Wtime = (parseFloat(req.body.skill2_w) / tempdata) * 100;    
    returnSkill2_Wtime = returnSkill2_Wtime.toPrecision(4);                    

    // 스킬 1번째 초기화 순번
    returnSkill1_chance = returnSkill1_Wtime / returnActPower;
    returnSkill1_chance = Math.ceil(returnSkill1_chance);

    // 스킬 2번째 초기화 순번
    returnSkill2_chance = returnSkill1_Wtime / returnActPower;
    returnSkill2_chance = Math.ceil(returnSkill2_chance);            

    res.json(returnActPower + "," + returnSkill1_Wtime + "," + returnSkill2_Wtime + "," + returnSkill1_chance + "," + returnSkill2_chance);
}