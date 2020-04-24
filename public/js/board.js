var db = require('./connection.js');
const ejs = require('ejs');
var sql = '';

exports.home = function(request, response) {
  if (request.query.tbl == "1") {
	sql = 'SELECT count(*) as cnt FROM bbs_notice';
    } else if (request.query.tbl == "2") {
	sql = 'SELECT count(*) as cnt FROM bbs_gallery';
    } else if (request.query.tbl == "3") {
	sql = 'SELECT count(*) as cnt FROM bbs_free';
    }
  db.query(sql, function(error, result) {
    var totalCount = result[0].cnt;
    if (request.query.tbl == "1") {
      sql = 'SELECT id, author, title, content, hit, date_format(date,"%Y-%m-%d") as date FROM bbs_notice ORDER BY id DESC LIMIT ?, 10';

    } else if (request.query.tbl == "2") {
      sql = 'SELECT id, author, title, content, hit, date_format(date,"%Y-%m-%d") as date FROM bbs_gallery ORDER BY id DESC LIMIT ?, 10';

    } else if (request.query.tbl == "3") {
      sql = 'SELECT id, author, title, content, hit, date_format(date,"%Y-%m-%d") as date FROM bbs_free ORDER BY id DESC LIMIT ?, 10';
    }

    db.query(sql, [((request.query.pageNum-1) * 10)], function(error, results) {
      var totalPage = totalCount / 10;
      if (totalCount % 10 > 0) {
        totalPage++; // 10개로 나눠도 남으면 페이지 하나 더
      }
      var startPage = ((request.query.pageNum  -1) / 10) * 10 + 1;
      var endPage = startPage + 10 -1;
      if( endPage > totalPage) {
        endPage = totalPage;
      }
      endPage = parseInt(endPage);
      response.render('board', {totalCount : totalCount, pageNum : request.query.pageNum, start : startPage, end : endPage, data : results, tbl : request.query.tbl});
      });

    });
}

exports.write = function(request, response) {
  var author = request.body.author;
  var title = request.body.title;
  var content = request.body.content;
  if (request.body.tbl == "1") {
    sql = 'INSERT INTO bbs_notice(author, title, content) values (?, ?, ?)';
    } else if (request.body.tbl == "2") {
      sql = 'INSERT INTO bbs_gallery(author, title, content) values (?, ?, ?)';
    } else if (request.body.tbl == "3") {
      sql = 'INSERT INTO bbs_free(author, title, content) values (?, ?, ?)';
    }
  db.query(sql, [author, title, content], function(error, result) {
	if(request.body.tbl == "1") {
	  response.redirect('/board.ejs?tbl=1&pageNum=1');
	} else if(request.body.tbl == "2") {
	  response.redirect('/board.ejs?tbl=2&pageNum=1');
	} else if(request.body.tbl == "3") {
	  response.redirect('/board.ejs?tbl=3&pageNum=1');
	}
    });
}

exports.view = function(request, response) {  
  var tbl = request.query.tbl;
  if (tbl == "1") {
      sql = 'SELECT author, title, content, hit, date_format(date,"%Y-%m-%d") as date FROM bbs_notice where id = ?';

    } else if (tbl == "2") {
      sql = 'SELECT author, title, content, hit, date_format(date,"%Y-%m-%d") as date FROM bbs_gallery where id = ?';

    } else if (tbl == "3") {
      sql = 'SELECT author, title, content, hit, date_format(date,"%Y-%m-%d") as date FROM bbs_free where id = ?';
    }

  db.query(sql, [request.query.id], function(error, result) {
      if (tbl == "1") {
      sql = 'SELECT id, title FROM bbs_notice WHERE id < ? ORDER BY id DESC LIMIT 1';  
    } else if (tbl == "2") {
      sql = 'SELECT id, title FROM bbs_gallery WHERE id < ? ORDER BY id DESC LIMIT 1';  
    } else if (tbl == "3") {
      sql = 'SELECT id, title FROM bbs_free WHERE id < ? ORDER BY id DESC LIMIT 1';  
    }
    db.query(sql, [request.query.id], function(error, pre) {
      if (tbl == "1") {
      sql = 'SELECT id, title FROM bbs_notice WHERE id > ? ORDER BY id LIMIT 1';
    } else if (tbl == "2") {
      sql = 'SELECT id, title FROM bbs_gallery WHERE id > ? ORDER BY id LIMIT 1';
    } else if (tbl == "3") {
      sql = 'SELECT id, title FROM bbs_free WHERE id > ? ORDER BY id LIMIT 1';
    }
    db.query(sql, [request.query.id], function(error, next) {

    response.render('board_view', {data : result, tbl : tbl, pre : pre, next : next});
    });
    });
    });
    if (tbl == "1") {
      sql = 'UPDATE bbs_notice SET hit = hit + 1 where id = ?';
    } else if (tbl == "2") {
      sql = 'UPDATE bbs_gallery SET hit = hit + 1 where id = ?';
    } else if (tbl == "3") {
      sql = 'UPDATE bbs_free SET hit = hit + 1 where id = ?';
    }

  db.query(sql, [request.query.id], function(error, result) {
    });
}

exports.editView = function(request, response) {
  sql = 'SELECT id, author, title, content, hit, date_format(date,"%Y-%m-%d") as date FROM bbs_free WHERE id = ?';
  db.query(sql, [request.query.id], function(error, result) {
    response.render('board_editview', {data : result});
    });
}

exports.edit = function(request, response) {
  var title = request.body.title;
  var content = request.body.content;
  var id = request.body.id;
  sql = 'UPDATE bbs_free SET title = ?, content = ? where id = ?';
  db.query(sql, [title, content, id], function(error, result) {
    response.redirect('/./board_view.ejs?id=' + id);

    });
}

exports.delete = function(request, response) {
  sql = 'DELETE FROM bbs_free WHERE id = ?';
  db.query(sql, [request.query.id], function(error, result) {
    response.redirect('/./board.ejs?pageNum=1');
    });
}
