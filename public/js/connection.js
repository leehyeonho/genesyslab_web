var mysql = require('mysql');

var connection = mysql.createConnection({
  host      : 'localhost',
  post:3306,
  user      : 'gene',
  password  : '110356tk@@',
  database  : 'genesys'
});

connection.connect();

// connection.query()

// connection.end();

module.exports = connection;
