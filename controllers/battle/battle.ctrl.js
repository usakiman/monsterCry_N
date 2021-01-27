const util = require("../util");
const itemList = require("../../conf/item_info");
const skillList = require("../../conf/item_skill");
const uuid4 = require('uuid4');

exports.get_index = (req , res) => {    

    var sql = " SELECT ";
	sql += " a.seq, a.card_seq, a.b_name, b.card_lv, ";
	sql += " b.card_star, b.card_health, b.card_attack, b.card_defense, ";
	sql += " c.cardname, c.cardlevel, c.cardtype, c.cardrace, c.cardactpower, c.maineffect, ";
	sql += " d.w_name, d.w_type, d.w_level, d.w_option1, d.w_option2, ";
	sql += " e.d_name, e.d_type, e.d_level, e.d_option1, e.d_option2, ";
	sql += " f.a_name, f.a_type, f.a_level, f.a_option1, f.a_option2 ";
    sql += " FROM battle_list a INNER JOIN card_info_detail b ON a.card_seq = b.seq ";
    sql += " INNER JOIN card_info c ON b.main_seq = c.seq ";
    sql += " INNER JOIN weapon_info d ON a.w_seq = d.seq ";
    sql += " INNER JOIN defense_info e ON a.d_seq = e.seq ";
    sql += " INNER JOIN ass_info f ON a.a_seq = f.seq ";
    sql += " where a.user_uid = ? ";
    sql += " ORDER BY a.b_name DESC ";

    params = [req.session.loginID];

    gMysqlConn.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            res.render( './battle' , 
            {         
                list:rows,                
                title: "전투 시뮬레이터 리스트"
            }
            );               
        }
    });                  
}

exports.get_CardMake = (req , res) => {

    var t_seq = "";

    if (req.query.t_seq != undefined) {
        t_seq = req.query.t_seq;
    }

    var sql = "SELECT ";
    sql += " a.cardname, a.cardlevel, a.cardtype, a.cardrace, a.cardactpower, a.cardactive1_waiting, a.cardactive2_waiting, a.maineffect, ";
	sql += " b.* ";
    sql += " FROM card_info a INNER JOIN card_info_detail b ON a.seq = b.main_seq ORDER BY cardlevel DESC, cardname";

    var sqlWeapon = "SELECT * FROM weapon_info ORDER BY w_type, w_option1 DESC";
    var sqlDefense = "SELECT * FROM defense_info ORDER BY d_type, d_option1 DESC";
    var sqlAss = "SELECT * FROM ass_info ORDER BY a_type, a_option1 DESC";

    var sqlWeaponSkill1 = "SELECT * FROM weapon_skill WHERE skill_num = 1 AND user_uid = ?";
    var sqlWeaponSkill2 = "SELECT * FROM weapon_skill WHERE skill_num = 2 AND user_uid = ?";

    var sqlDefenseSkill1 = "SELECT * FROM defense_skill WHERE skill_num = 1 AND user_uid = ?";
    var sqlDefenseSkill2 = "SELECT * FROM defense_skill WHERE skill_num = 2 AND user_uid = ?";

    var sqlAssSkill1 = "SELECT * FROM ass_skill WHERE skill_num = 1 AND user_uid = ?";
    var sqlAssSkill2 = "SELECT * FROM ass_skill WHERE skill_num = 2 AND user_uid = ?";

    var skillParams = [req.session.loginID];
    
    var sqlSelect = "SELECT * FROM battle_list WHERE seq = ? and user_uid = ?";
    var params = [t_seq, req.session.loginID];
    
    (async () => {
        try {
            var cardlist = await queryExec(sql, null);
            var wlist = await queryExec(sqlWeapon, null);
            var dlist = await queryExec(sqlDefense, null);
            var alist = await queryExec(sqlAss, null);

            const res1 = await queryExec(sqlWeaponSkill1, skillParams);
            const res2 = await queryExec(sqlWeaponSkill2, skillParams);
            const res3 = await queryExec(sqlDefenseSkill1, skillParams);
            const res4 = await queryExec(sqlDefenseSkill2, skillParams);
            const res5 = await queryExec(sqlAssSkill1, skillParams);
            const res6 = await queryExec(sqlAssSkill2, skillParams);    
            
            const results = await queryExec_results(sqlSelect, params);
            if (results.length > 0)

            var card_seq, b_name, w_seq, w_stone1, w_stone2, w_skill1, w_skill2;
            var d_seq, d_stone1, d_stone2, d_skill1, d_skill2;
            var a_seq, a_stone1, a_stone2, a_skill1, a_skill2;                                            
            
            if (results.length > 0) {
                card_seq = results[0].card_seq;
                b_name = results[0].b_name;
                w_seq = results[0].w_seq;
                w_stone1 = results[0].w_stone1_option;
                w_stone2 = results[0].w_stone2_option;
                w_skill1 = results[0].w_skill1_seq;
                w_skill2 = results[0].w_skill2_seq;
                d_seq = results[0].d_seq;
                d_stone1 = results[0].d_stone1_option;
                d_stone2 = results[0].d_stone2_option;
                d_skill1 = results[0].d_skill1_seq;
                d_skill2 = results[0].d_skill2_seq;
                a_seq = results[0].a_seq;
                a_stone1 = results[0].a_stone1_option;
                a_stone2 = results[0].a_stone2_option;
                a_skill1 = results[0].a_skill1_seq;
                a_skill2 = results[0].a_skill2_seq;
            }                                            

            res.render( './battle/cardmake' , 
            {         
                cardlist:cardlist,
                wlist:wlist,
                dlist:dlist,
                alist:alist,
                itemlist:itemList,
                wlist_skill1:res1,
                wlist_skill2:res2,
                dlist_skill1:res3,
                dlist_skill2:res4,
                alist_skill1:res5,
                alist_skill2:res6,

                t_seq:t_seq,

                card_seq:card_seq,
                b_name:b_name,
                w_seq:w_seq,
                w_stone1:w_stone1,
                w_stone2:w_stone2,
                w_skill1:w_skill1,
                w_skill2:w_skill2,
                d_seq:d_seq,
                d_stone1:d_stone1,
                d_stone2:d_stone2,
                d_skill1:d_skill1,
                d_skill2:d_skill2,
                a_seq:a_seq,
                a_stone1:a_stone1,
                a_stone2:a_stone2,
                a_skill1:a_skill1,
                a_skill2:a_skill2,

                title: "전투 시뮬레이터 카드생성"
            }
            );    
                        
        } catch (err) {
            util.log(err)
        }
    })();        
    
}

exports.get_Skill = (req , res) => {    

    var type = "";
    var num = "";
    var skill = "";
    var setList = null;
    var setText = "";
    var skill1_min = 0;
    var skill1_max = 0;
    var skill2_min = 0;
    var skill2_max = 0;

    if (req.query.type != undefined) type = req.query.type;    
    if (req.query.num != undefined) num = req.query.num;
    if (req.query.skill != undefined) skill = req.query.skill;
    
    if (type == "w" && num == "1") {
        setList = skillList.weapon_skill_1;                
    }
    if (type == "w" && num == "2") {
        setList = skillList.weapon_skill_2;
    }

    if (setList != null) {
        if (skill != "") {

            setList.forEach(element => {
                if (element.name == skill) {
                    var temp = element.text;
                    var tempmin = element.min_data.split("|");
                    var tempmax = element.max_data.split("|");

                    if (temp.indexOf("%2%") > 0) {
                        setText = temp.replace("%1%", "(" + tempmin[0] + "%~" + tempmax[0] + "%)");
                        setText = setText.replace("%2%", "(" + tempmin[1] + "%~" + tempmax[1] + "%)");

                        skill1_min = tempmin[0];
                        skill1_max = tempmax[0];

                        skill2_min = tempmin[1];
                        skill2_max = tempmax[1];
                    } else {
                        setText = temp.replace("%1%", "(" + tempmin[0] + "%~" + tempmax[0] + "%)");

                        skill1_min = tempmin[0];
                        skill1_max = tempmax[0];
                    }                    
                }
            });            
        }
    }
            
    res.render( './battle/skill' , 
    {
        type:type,
        num:num,
        skill:skill,
        skillList:setList,
        skillText:setText,
        skill1_min:skill1_min,
        skill1_max:skill1_max,
        skill2_min:skill2_min,
        skill2_max:skill2_max,
        title: "전투 시뮬레이터 스킬관리"
    }
    );               
    
}

exports.get_Simul = (req , res) => {    
    
    res.render( './battle/simul' , 
    {                 
        title: "전투 시뮬레이터"
    }
    );               
}




exports.set_CardMake_Save = (req, res) => {
    util.log(req.body);

    var w_skill1 = (req.body.w_skill1 == "") ? "NULL" : req.body.w_skill1;
    var w_skill2 = (req.body.w_skill2 == "") ? "NULL" : req.body.w_skill2;

    var d_skill1 = (req.body.d_skill1 == "") ? "NULL" : req.body.d_skill1;
    var d_skill2 = (req.body.d_skill2 == "") ? "NULL" : req.body.d_skill2;

    var a_skill1 = (req.body.a_skill1 == "") ? "NULL" : req.body.a_skill1;
    var a_skill2 = (req.body.a_skill2 == "") ? "NULL" : req.body.a_skill2;


    var sql = " INSERT INTO battle_list ";
    sql += " (seq, card_seq, b_name, user_uid,  ";
    sql += " w_seq, w_stone1_name, w_stone1_option, w_stone2_name, w_stone2_option, w_skill1_seq, w_skill2_seq, ";
    sql += " d_seq, d_stone1_name, d_stone1_option, d_stone2_name, d_stone2_option, d_skill1_seq, d_skill2_seq, ";
    sql += " a_seq, a_stone1_name, a_stone1_option, a_stone2_name, a_stone2_option, a_skill1_seq, a_skill2_seq) ";
    sql += " VALUES  ";

    if (req.body.t_seq == "") sql += " (seq,  ";
    else sql += " ("+req.body.t_seq+",  ";

    sql += " ?, ?, ?, ";
    sql += " ?, '', ?, '', ?, "+w_skill1+", "+w_skill2+", ";
    sql += " ?, '', ?, '', ?, "+d_skill1+", "+d_skill2+", ";
    sql += " ?, '', ?, '', ?, "+a_skill1+", "+a_skill2+" ";
    sql += " ) ";
    sql += " ON DUPLICATE KEY  ";
    sql += " UPDATE ";
    sql += " card_seq = "+req.body.seq+", ";
    sql += " b_name = '"+req.body.cardname+"', ";
    sql += " user_uid = '"+req.session.loginID+"', ";
    sql += " w_seq = "+req.body.w_seq+", ";
    sql += " w_stone1_name = '', ";
    sql += " w_stone1_option = '"+req.body.w_stone1+"', ";
    sql += " w_stone2_name = '', ";
    sql += " w_stone2_option = '"+req.body.w_stone2+"', ";
    
    sql += " w_skill1_seq = "+w_skill1+", ";
    sql += " w_skill2_seq = "+w_skill2+", ";
    
    sql += " d_seq = "+req.body.d_seq+", ";
    sql += " d_stone1_name = '', ";
    sql += " d_stone1_option = '"+req.body.d_stone1+"', ";
    sql += " d_stone2_name = '', ";
    sql += " d_stone2_option = '"+req.body.d_stone2+"', ";

    sql += " d_skill1_seq = "+d_skill1+", ";
    sql += " d_skill2_seq = "+d_skill2+", ";
    
    sql += " a_seq = "+req.body.a_seq+", ";
    sql += " a_stone1_name = '', ";
    sql += " a_stone1_option = '"+req.body.a_stone1+"', ";
    sql += " a_stone2_name = '', ";
    sql += " a_stone2_option = '"+req.body.a_stone2+"', ";

    sql += " a_skill1_seq = "+a_skill1+", ";
    sql += " a_skill2_seq = "+a_skill2+"; ";    

    var params = [req.body.seq, req.body.cardname, req.session.loginID,
        req.body.w_seq, req.body.w_stone1, req.body.w_stone2,
        req.body.d_seq, req.body.d_stone1, req.body.d_stone2,
        req.body.a_seq, req.body.a_stone1, req.body.a_stone2
    ];    
            
    gMysqlConn.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted.\n' + err);
        else {                                    
            res.json("SUCCESS");
        }
    });                                                          
}


exports.set_CardMake_Delete = (req, res) => {
        
    var sql = " delete from battle_list where seq = ? and user_uid = ? ";    
    
    var params = [req.body.seq, req.session.loginID];  
            
    gMysqlConn.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted.\n' + err);
        else {                                    
            res.json("SUCCESS");
        }
    });                                                          
}


exports.set_Skill_Save = (req, res) => {
    var setList = null;

    var type = req.body.type;
    var num = req.body.num;
    var skill = req.body.skill;
    var skillset1 = req.body.skillset1;
    var skillset2 = req.body.skillset2;

    var name = skill + " (" + uuid4().substr(0, 8) + ")";
    var text = "";
    var data = "";
    var sql = "";

    if (type == "w" && num == "1") {
        setList = skillList.weapon_skill_1;
        sql = " INSERT INTO weapon_skill (user_uid, s_name, skill_num, skill_name, skill_text, skill_data) VALUES (?, ?, ?, ?, ?, ?); ";
    }
    if (type == "w" && num == "2") {
        setList = skillList.weapon_skill_2;
        sql = " INSERT INTO weapon_skill (user_uid, s_name, skill_num, skill_name, skill_text, skill_data) VALUES (?, ?, ?, ?, ?, ?); ";
    }
    
    setList.forEach(element => {
        if (element.name == skill) {
            text = element.text;

            if (skillset1 != "") {
                text = text.replace("%1%", skillset1 + "%");
                data = skillset1;
            }

            if (skillset2 != "") {
                text = text.replace("%2%", skillset2 + "%");
                data += "|" + skillset2;
            }            
        }
    });
            
    
    var params = [req.session.loginID, name, num, skill, text, data];  
            
    gMysqlConn.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted.\n' + err);
        else {                                    
            res.json("SUCCESS");
        }
    });                                                          
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