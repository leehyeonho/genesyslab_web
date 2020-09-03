var db = require('./connection.js');
const ejs = require('ejs');
var sql = '';

exports.view = function(request, response) {
  var tbl = request.query.tbl;
  var sql = "";
  sql = 'SELECT * FROM research';
  db.query(sql, function(error, result_research) {
  if(tbl == 'professor') {
    sql = 'SELECT * FROM professor';
      db.query(sql, function(error, result) {
        response.render('sub', {session : request.session, data : result, data_research : result_research, tbl : tbl});
        });
  } else if(tbl == 'candidate1') {
    sql = 'SELECT * FROM candidate WHERE position=1';
    db.query(sql, function(error, result) {
      response.render('sub', {session : request.session, data : result, data_research : result_research, tbl : tbl});
      });
  } else if(tbl == 'candidate2') {
    sql = 'SELECT * FROM candidate WHERE position=2';
    db.query(sql, function(error, result) {
      response.render('sub', {session : request.session, data : result, data_research : result_research, tbl : tbl});
      });
  } else if(tbl == 'alumni') {
    sql = 'SELECT * FROM candidate WHERE position=3';
    db.query(sql, function(error, result) {
      response.render('sub', {session : request.session, data : result, data_research : result_research, tbl : tbl});
      });
  } else {
      for(var i=0;i<10;i++) {
        if( tbl == ("research" + i)) {
          response.render('sub', {session : request.session, data_research : result_research, researchId : i, tbl : tbl});
          break;
        }
      }
  }
  });

}
