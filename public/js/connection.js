var mysql = require('mysql');

var dev_connectionId = 1;
var connection;
switch (dev_connectionId) {
  case 1:
  connection = mysql.createConnection({
    host      : 'localhost',
    port:3306,
    user      : 'root',
    password  : 'genesys11',
    database  : 'genesys'
  });
    break;
  case 2:
  connection = mysql.createConnection({
    host      : 'localhost',
    port:3306,
    user      : 'root',
    password  : 'customlab11',
    database  : 'genesys'
  });
    break;
  case 3:
  connection = mysql.createConnection({
    host      : 'localhost',
    port:3306,
    user      : 'root',
    password  : '110356tk@@',
    database  : 'genesys'
  });
    break;
  default:

}


connection.connect();

// connection.query()

// connection.end();

module.exports = connection;
