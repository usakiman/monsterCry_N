var mysql = require('mysql');
var os = require('os');

var dbconnInfo = {
	company:{
		host: 'localhost',
		port: '3306',
		user: 'root',
		password: 'sailorut',
		database: 'mysql', 
		multipleStatements : true
	},
	dev:{
		host: 'localhost',
		port: '3306',
		user: 'choiyw2',
		password: 'sailorut',
		database: 'mysql', 
		multipleStatements : true
	},
	real:{
        host     : 'usaki.cafe24app.com',        
		port: '3306',
		user     : 'choiyw22',
		password : 'eago25!@',
		database : 'choiyw22',
		multipleStatements : true
	}	
};

var dbconnection = {
	init : function(){
        var hostname = os.hostname();
        console.log(hostname);
		if(hostname === 'MSDN-SPECIAL'){
            console.log(dbconnInfo.dev);
			return mysql.createConnection(dbconnInfo.dev);	//로컬개발환경
		}
		else if (hostname === 'LAPTOP-DI6GLDAU') {
			console.log(dbconnInfo.company);
			return mysql.createConnection(dbconnInfo.company);	//회사개발환경
		}
		else{
            console.log(dbconnInfo.real);
			return mysql.createConnection(dbconnInfo.real);	//cafe24 서버환경
		}
	},
	
	connect : function(con){
		con.connect(function(err){
			if(err){
				console.error("mysql connection error : " + err);
			}else{
				console.info("mysql connection successfully.");
			}
        });                
	}
};


module.exports = dbconnection;