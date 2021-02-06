const util = require("../util");
const itemList = require("../../conf/item_info");
const skillList = require("../../conf/item_skill");
const uuid4 = require('uuid4');

exports.get_index = (req , res) => {       
    var race = null;
    if (req.query.race != undefined) race = req.query.race;    

    var sql = " SELECT ";
	sql += " b.seq, b.card_lv, ";
	sql += " b.card_star, b.card_health, b.card_attack, b.card_defense, ";
	sql += " c.cardname, c.cardlevel, c.cardtype, c.cardrace, c.cardactpower, c.maineffect ";
	sql += " FROM card_info_detail b";
    sql += " INNER JOIN card_info c ON b.main_seq = c.seq ";
    if (race != null && race != "") sql += " where c.cardrace = ? ";    
    sql += " ORDER BY c.cardlevel desc, c.cardname ";

    params = [race];

    gMysqlConn.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            res.render( './cardlist' , 
            {         
                race:race,
                list:rows,                
                title: "카드 리스트"
            }
            );               
        }
    });                  
}

exports.get_cardinfo = (req, res) => {
    var seq = req.body.seq;

    var sql = "SELECT ";
    sql += " b.seq, b.card_lv, ";
    sql += " b.card_star, b.card_health, b.card_attack, b.card_defense, ";
    sql += " b.card_active1_name, b.card_active1_text, b.card_active1_ex_time, b.card_active1_data, ";
    sql += " b.card_active2_name, b.card_active2_text, b.card_active2_ex_time, b.card_active2_data, ";
    sql += " b.card_passive1_name, b.card_passive1_text, b.card_passive1_data, ";
    sql += " b.card_passive2_name, b.card_passive2_text, b.card_passive2_data, ";
    sql += " b.card_info, ";
    sql += " c.cardname, c.cardlevel, c.cardtype, c.cardrace, c.cardactpower, c.maineffect, ";
    sql += " c.cardactive1_waiting, c.cardactive2_waiting ";
        
    sql += " FROM card_info_detail b ";
    sql += " INNER JOIN card_info c ON b.main_seq = c.seq ";
    sql += " WHERE b.seq = :seq ";

    sql = sql.replace(":seq", seq);     
    
    (async () => {
        try {
            const res1 = await util.queryExec_rows(sql, "");
            
            res.json(res1);
        } catch (err) {
            util.log(err)
        }
    })();
}


const queryExec = (sql, params) => new Promise ((resolve, reject) => {
    gMysqlConn.query(sql, params, function (err, rows, fields) {
        err ? reject(err) : resolve(rows) // reject는 예외 처리를 할 때 사용합니다.
    })
})

const queryExec_results = (sql, params) => new Promise ((resolve, reject) => {
    gMysqlConn.query(sql, params, function (err, results, fields) {
        err ? reject(err) : resolve(results) // reject는 예외 처리를 할 때 사용합니다.
    })
})

/*
(async () => {
    try {
        const res1 = await queryExec(sqlWeaponSkill1, skillParams);
        const res2 = await queryExec(sqlWeaponSkill2, skillParams);
        const res3 = await queryExec(sqlDefenseSkill1, skillParams);
        const res4 = await queryExec(sqlDefenseSkill2, skillParams);
        const res5 = await queryExec(sqlAssSkill1, skillParams);
        const res6 = await queryExec_results(sqlAssSkill2, skillParams);            
                                     
    } catch (err) {
        util.log(err)
    }
})();        
*/