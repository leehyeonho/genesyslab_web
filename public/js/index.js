var db = require('./connection.js');
const ejs = require('ejs');
var sql = '';

exports.index = function(request, response) {
  var cnt = 0;
  sql = 'SELECT count(*) as cnt FROM bbs_notice';
  db.query(sql, function(err, result) {
    cnt = result[0].cnt;
  });
  if(cnt-4 < 0) {
    sql = 'SELECT id, title, content, date_format(date, "%Y") as YYYY, date_format(date, "%m-%d") as mmdd FROM bbs_notice ORDER BY id DESC';
  } else {
    sql = 'SELECT id, title, content, date_format(date, "%Y") as YYYY, date_format(date, "%m-%d") as mmdd FROM bbs_notice ORDER BY id DESC LIMIT 0, 4';
  }
  db.query(sql, function(err, results) {
    response.render('index', {session : request.session, data : results});
  });
   
}
