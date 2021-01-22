const util = require("../util");

exports.get_index = (req , res) => {    

    var yy = new Date().getFullYear();
    var mm = new Date().getMonth() + 1;
    if (mm < 10) mm = "0" + mm;
    var dd = new Date().getDate();
    if (dd < 10) dd = "0" + dd;

    var date = yy.toString() + mm.toString();            
    
    var sql = "SELECT '1' AS gubun, ymd, format(score1,0) as score1, format(score2,0) as score2, format(scoresum,0) as scoresum FROM asmonel ";
    sql += " WHERE u_seq = (SELECT seq FROM user_table WHERE uid = ?) ";
    sql += " AND SUBSTR(ymd,1,6) = ? ";
    sql += " UNION ALL ";
    sql += " SELECT  ";
    sql += " '2' AS gubun, '합계', format(SUM(score1),0), format(SUM(score2),0), format(SUM(scoresum),0) ";
    sql += " FROM asmonel  ";
    sql += " WHERE u_seq = (SELECT seq FROM user_table WHERE uid = ?) ";
    sql += " AND SUBSTR(ymd,1,6) = ? ";
    sql += " UNION ALL ";
    sql += " SELECT  ";
    sql += " '3' AS gubun, '평균', format(ROUND(AVG(score1)),0), format(ROUND(AVG(score2)),0), format(ROUND(AVG(scoresum)),0) ";
    sql += " FROM asmonel  ";
    sql += " WHERE u_seq = (SELECT seq FROM user_table WHERE uid = ?) ";
    sql += " AND SUBSTR(ymd,1,6) = ? ";

    sql += " ORDER BY gubun asc, ymd DESC";    

    var params = [req.session.loginID, date, req.session.loginID, date, req.session.loginID, date];        
    
    gMysqlConn.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {            
            var sql2 = "select * from user_table where uid = ?";
            var parmas2 = [req.session.loginID];

            gMysqlConn.query(sql2, parmas2, function (err, results, fields) {
                if(err) util.log('query is not excuted. select fail\n' + err);
                else {            
                    if (results != null) {
                        res.render( './asmonel' , 
                        { 
                            list:rows,
                            acc_cnt:results[0].account_cnt,
                            title: "아스모넬 입력 메뉴"
                        }
                        ); 
                    }
                }
            });   
            
        }
    });            
}

exports.get_stat = ( req , res) => {    
        
    var year = "";
    var month = (req.query.month == undefined) ? "" : req.query.month;
    var day = (req.query.day == undefined) ? "" : req.query.day;;
    var uid = (req.query.uid == undefined) ? "" : req.query.uid;
    var order = (req.query.ord == undefined) ? "" : req.query.ord;

    if (req.query.year != null) {
        year = req.query.year;
    } else {
        year = new Date().getFullYear();
    }      
    
    var sql = statQuery(year, month, day, uid, order);    

    var sqlUsers = "SELECT * FROM user_table WHERE STATUS >= 2 AND STATUS <= 3";            
    var users;
    gMysqlConn.query(sqlUsers, function (err, rows, fields) {
        if(err) util.log('query is not excuted. select fail\n' + err);
        else {                  
            users = rows;
            
            gMysqlConn.query(sql, function (err, rows, fields) {
                if(err) util.log('query is not excuted. select fail\n' + err);
                else {            
                    
                    res.render( './asmonel/stat' , 
                    { 
                        list:rows,
                        year:year,
                        month:month,
                        day:day,
                        uid:uid,
                        users:users,
                        order:order,
                        myid:req.session.loginID,
                        title: "아스모넬 통계 메뉴"
                    }
                ); 
                }
            });       
        }
    });                 
    
}

exports.set_save = (req, res) => {
    util.log(req.body);

    var date = req.body.date.replace(/-/g, "");
    var scoresum = req.body.scoresum.replace(/,/g, "");
    var score1 = req.body.score1.replace(/,/g, "");
    var score2 = req.body.score2.replace(/,/g, "");
    var acc_cnt = req.body.acc_cnt.replace(/,/g, "");

    var sql = "INSERT INTO asmonel (u_seq, ymd, scoresum, score1, score2) VALUES ((SELECT seq FROM user_table WHERE uid = ?), ?, ?, ?, ?);";
    var params = [req.session.loginID, date, scoresum, score1, score2, acc_cnt];    
        
    //var mysql = util.mysqlConnecter();
    gMysqlConn.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted.\n' + err);
        else {                                    
            var sql2 = "update user_table set account_cnt = ? where uid = ?";
            var params2 = [acc_cnt, req.session.loginID];
                                    
            gMysqlConn.query(sql2, params2, function (err, results, fields) {
                if(err) util.log('query is not excuted.\n' + err);
                else {                                                        
                    res.json("SUCCESS");
                }
            });                            
        }
    });                                                          
}

exports.set_saveChk = (req, res) => {
    util.log(req.body);

    var date = req.body.date.replace(/-/g, "");

    var sql = "SELECT * FROM asmonel ";
    sql += " WHERE u_seq = (SELECT seq FROM user_table WHERE uid = ?) ";
    sql += " AND ymd = ?;";
    
    var params = [req.session.loginID, date];
                
    //var mysql = util.mysqlConnecter();
    gMysqlConn.query(sql, params, function (err, result, fields) {
        if(err) util.log('query is not excuted.\n' + err);
        else {  
            var returnValue = "";            
            if (result[0] == undefined) {
                returnValue = "";
            } else {
                returnValue = result[0];
            }
            res.json(returnValue);
        }
    });                                                          
}

exports.set_update = (req, res) => {
    util.log(req.body);

    var date = req.body.date.replace(/-/g, "");
    var scoresum = req.body.scoresum.replace(/,/g, "");
    var score1 = req.body.score1.replace(/,/g, "");
    var score2 = req.body.score2.replace(/,/g, "");
    var acc_cnt = req.body.acc_cnt.replace(/,/g, "");

    var sql = "UPDATE asmonel ";
    sql += " SET scoresum = ?, score1 = ?, score2 = ?";
    sql += " WHERE u_seq = (SELECT seq FROM user_table WHERE uid = ?) ";
    sql += " AND ymd = ? ";

    var params = [scoresum, score1, score2, req.session.loginID, date];
        
    //var mysql = util.mysqlConnecter();
    gMysqlConn.query(sql, params, function (err, rows, fields) {
        if(err) util.log('query is not excuted.\n' + err);
        else {                                    
            var sql2 = "update user_table set account_cnt = ? where uid = ?";
            var params2 = [acc_cnt, req.session.loginID];
                                    
            gMysqlConn.query(sql2, params2, function (err, results, fields) {
                if(err) util.log('query is not excuted.\n' + err);
                else {                                                        
                    res.json("SUCCESS");
                }
            });                
        }
    });                                                          
}

var statQuery = function(yy, mm, dd, uid, ord) {

    var sql = "";    

    var month = "";
    var day = "";
    var where = "";
    var select = "";
    var group = "";  
    var orderby = "";

    var rate_sel = ", '0', '0' ";
    
    if (mm != "" && dd != "") {
        month = yy.toString() + mm.toString();
        day = yy.toString() + mm.toString() + dd.toString();

        where = " and ymd = '"+day+"' ";
        select = " ymd AS ym, ";
        group = " GROUP BY ymd, uid ";        

        rate_sel = " ,FORMAT(CASE WHEN IFNULL((SELECT scoresum FROM asmonel WHERE u_seq = a.u_seq AND ymd = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 DAY), '%Y%m%d')), 0) = 0 THEN 0 ";
        rate_sel += " ELSE SUM(scoresum) - IFNULL((SELECT scoresum FROM asmonel WHERE u_seq = a.u_seq AND ymd = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 DAY), '%Y%m%d')), 0) END,0) AS rate_sum, ";    
        rate_sel += " ROUND(CASE WHEN  ";
        rate_sel += " (SUM(scoresum) - IFNULL((SELECT scoresum FROM asmonel WHERE u_seq = a.u_seq AND ymd = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 DAY), '%Y%m%d')), 0))  ";
        rate_sel += " / SUM(scoresum) = 1 THEN 0 ";
        rate_sel += " ELSE ";
        rate_sel += " IFNULL(((SUM(scoresum) - IFNULL((SELECT scoresum FROM asmonel WHERE u_seq = a.u_seq AND ymd = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 DAY), '%Y%m%d')), 0))  ";
        rate_sel += " / SUM(scoresum)) * 100,0) ";
        rate_sel += " END,2) ";
        rate_sel += " AS rate_avg ";
    } else if (mm != "") {
        month = yy.toString() + mm.toString();
        
        where = " and substr(ymd,1,6) = '"+month+"' ";
        select = " SUBSTR(ymd,1,8) AS ym, ";
        group = " GROUP BY SUBSTR(ymd,1,8), uid ";

        rate_sel = " ,FORMAT(CASE WHEN IFNULL((SELECT scoresum FROM asmonel WHERE u_seq = a.u_seq AND ymd = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 DAY), '%Y%m%d')), 0) = 0 THEN 0 ";
        rate_sel += " ELSE SUM(scoresum) - IFNULL((SELECT scoresum FROM asmonel WHERE u_seq = a.u_seq AND ymd = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 DAY), '%Y%m%d')), 0) END,0) AS rate_sum, ";    
        rate_sel += " ROUND(CASE WHEN  ";
        rate_sel += " (SUM(scoresum) - IFNULL((SELECT scoresum FROM asmonel WHERE u_seq = a.u_seq AND ymd = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 DAY), '%Y%m%d')), 0))  ";
        rate_sel += " / SUM(scoresum) = 1 THEN 0 ";
        rate_sel += " ELSE ";
        rate_sel += " IFNULL(((SUM(scoresum) - IFNULL((SELECT scoresum FROM asmonel WHERE u_seq = a.u_seq AND ymd = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 DAY), '%Y%m%d')), 0))  ";
        rate_sel += " / SUM(scoresum)) * 100,0) ";
        rate_sel += " END,2) ";
        rate_sel += " AS rate_avg ";
    } else {
        where = "  ";
        select = " SUBSTR(ymd,1,6) AS ym, ";
        group = " GROUP BY SUBSTR(ymd,1,6), uid ";

        rate_sel = " ,FORMAT(CASE WHEN IFNULL((SELECT sum(scoresum) FROM asmonel WHERE u_seq = a.u_seq AND SUBSTR(ymd,1,6) = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 MONTH), '%Y%m')), 0) = 0 THEN 0 ";
        rate_sel += " ELSE SUM(scoresum) - IFNULL((SELECT sum(scoresum) FROM asmonel WHERE u_seq = a.u_seq AND SUBSTR(ymd,1,6) = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 MONTH), '%Y%m')), 0) END,0) AS rate_sum, ";    
        rate_sel += " ROUND(CASE WHEN  ";
        rate_sel += " (SUM(scoresum) - IFNULL((SELECT sum(scoresum) FROM asmonel WHERE u_seq = a.u_seq AND SUBSTR(ymd,1,6) = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 MONTH), '%Y%m')), 0))  ";
        rate_sel += " / SUM(scoresum) = 1 THEN 0 ";
        rate_sel += " ELSE ";
        rate_sel += " ((SUM(scoresum) - IFNULL((SELECT sum(scoresum) FROM asmonel WHERE u_seq = a.u_seq AND SUBSTR(ymd,1,6) = DATE_FORMAT(DATE_SUB(a.ymd, INTERVAL 1 MONTH), '%Y%m')), 0))  ";
        rate_sel += " / SUM(scoresum)) * 100 ";
        rate_sel += " END,2) ";
        rate_sel += " AS rate_avg ";
    }        

    if (uid != "") {                
        where += " AND u_seq = (SELECT seq FROM user_table WHERE uid = '"+uid+"') ";        
    }   
        
    switch (ord) {
        case "1":
            orderby = " ORDER BY gubun asc, ym asc, CONVERT(REPLACE(scoresum,',', ''), UNSIGNED) desc ";
            break;
        case "2":
            orderby = " ORDER BY gubun asc, ym asc, CONVERT(REPLACE(scoresum,',', ''), UNSIGNED) asc ";
            break;            
        case "3":
            orderby = " ORDER BY gubun asc, ym asc, CONVERT(REPLACE(scoreavg,',', ''), UNSIGNED) desc ";
            break;                        
        case "4":
            orderby = " ORDER BY gubun asc, ym asc, CONVERT(REPLACE(scoreavg,',', ''), UNSIGNED) asc ";
            break;                            
    
        default:
            orderby = " ORDER BY gubun asc, ym asc, uid ";
            break;
    }     

    sql += " SELECT ";
    sql += " '1' AS gubun,  ";

    sql += select;
    
    sql += " (SELECT concat(nickname, concat(' - [계정', concat(account_cnt, '개]')) ) FROM user_table WHERE seq = a.u_seq) AS uid, ";

    sql += " FORMAT(SUM(score1),0) AS score1, FORMAT(SUM(score2),0) AS score2, FORMAT(COUNT(scoresum),0) AS scorecnt, FORMAT(SUM(scoresum),0) AS scoresum, FORMAT(ROUND(AVG(scoresum)),0) AS scoreavg ";

    sql += rate_sel;

    sql += " FROM asmonel a WHERE SUBSTR(ymd, 1,4) = '"+yy+"'  ";

    sql += where;

    sql += group;

    sql += " UNION ALL ";
    sql += " SELECT  ";
    sql += " '2' AS gubun, '합계 or 평균' AS ym, '' AS uid, ";
    sql += " FORMAT(SUM(score1),0) AS score1, FORMAT(SUM(score2),0) AS score2, FORMAT(count(scoresum),0) AS scorecnt, FORMAT(SUM(scoresum),0) AS scoresum, FORMAT(ROUND(AVG(scoresum)),0) AS scoreavg, '-', '-' ";
    sql += " FROM asmonel a WHERE SUBSTR(ymd, 1,4) = '"+yy+"'  ";

    sql += where;

    /*
    sql += " UNION ALL ";
    sql += " SELECT  ";
    sql += " '3' AS gubun, '평균' AS ym, '' AS uid, ";
    sql += " FORMAT(ROUND(AVG(score1)),0) AS score1, FORMAT(ROUND(AVG(score2)),0) AS score2, FORMAT(ROUND(AVG(scoresum)),0) AS scoresum, '-' AS scoreavg, '-', '-' ";    
    sql += " FROM asmonel a WHERE SUBSTR(ymd, 1,4) = '"+yy+"'  ";
    
    sql += where;
    */
    
    sql += orderby;    

    return sql;
}