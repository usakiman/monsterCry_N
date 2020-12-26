var session = require('express-session');                      
var MySQLStore = require('express-mysql-session')(session);    
var os = require('os');

var options = {                                                 
  dev : {
    host: 'localhost',
    port: 3306,
    user: 'choiyw2',
    password: 'sailorut',
    database: 'mysql'
  },
  real : {
    host: 'usaki.cafe24app.com',
    port: 3306,
    user: 'choiyw22',
    password: 'eago25!@',
    database: 'choiyw22'
  }
};

var hostname = os.hostname();
var sessionStore = null;
if(hostname === 'MSDN-SPECIAL') {  
  sessionStore = new MySQLStore(options.dev);                    
} else {
  sessionStore = new MySQLStore(options.real);
}

module.exports = sessionStore;