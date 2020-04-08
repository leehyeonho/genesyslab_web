var mysql = require('mysql');

var connection = mysql.createConnection({
  host      : '',
  user      : '',
  password  : '',
  database  : ''
});

connection.connect();

// connection.query()

connection.end();
