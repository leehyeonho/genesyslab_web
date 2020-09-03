var db = require('./connection.js');
const ejs = require('ejs');
var sql = '';

exports.researchview = function(request, response) {
	sql = 'SELECT * FROM research';
    db.query(sql, function(error, result) {
      response.render('mod_research', {session : request.session, data : result});
      });
}

exports.resselect = function(request, response) {
	var select = request.body.researchSelect;
	sql = 'SELECT * FROM research';
    db.query(sql, function(error, result) {
      response.render('mod_resselect', {session : request.session, data : result});
      });
}

exports.researchmodview = function(request, response) {
	var researchId = request.query.id;
	sql = 'SELECT * FROM research';
    db.query(sql, function(error, result) {
      response.render('mod_researchmodview', {session : request.session, data : result, id : researchId-1});
      });
}

exports.researchmod = function(request, response) {
  var tblname = request.body.tblname;
  var content = request.body.content;
	var id = request.body.id;
  var img = request.file.path.substring(6);
	sql = 'UPDATE research SET tblname = ?, content = ?, img = ? WHERE id = ?';
    db.query(sql, [tblname, content, request.file.path.substring(6), id], function(error, result) {
      response.redirect('/success');
      // response.render('mod_professor', {session : request.session, data : result});
      });
}

exports.researchadd = function(request, response) {
  var content = request.body.content;
	var tblname = request.body.tblname;
  sql = 'INSERT INTO research(tblname, content, img) values (?, ?, ?)';
  db.query(sql, [tblname, content, request.file.path.substring(6)], function(error, result) {
    if(error) {
      console.log(error);
    }else {
      console.log("researchadd")
  	  response.redirect('/mod_researchaddview');
  	}
    });
}

exports.researchdel = function(request, response) {
  var name = request.body.name;
  console.log(name);
  var content = request.body.content;
  var tel = request.body.tel;
  var fax = request.body.fax;
  var email = request.body.email;
	sql = 'UPDATE research SET name = ?, content = ?, tel = ?, fax = ?, email = ? WHERE id = 1';
    db.query(sql, [name, content, tel, fax, email], function(error, result) {
      response.redirect('/mod_researchview');
      // response.render('mod_professor', {session : request.session, data : result});
      });
}

exports.professorview = function(request, response) {
	sql = 'SELECT * FROM professor';
    db.query(sql, function(error, result) {
			sql = 'SELECT tblname FROM research';
      db.query(sql, function(err, result_research) {
        response.render('mod_professor', {session : request.session, data : result, data_research : result_research});
      });
      });
}

exports.professor = function(request, response) {
  var name = request.body.name;
  console.log(name);
  var content = request.body.content;
  var tel = request.body.tel;
  var fax = request.body.fax;
  var email = request.body.email;
	sql = 'UPDATE professor SET name = ?, content = ?, tel = ?, fax = ?, email = ? WHERE id = 1';
    db.query(sql, [name, content, tel, fax, email], function(error, result) {
      response.redirect('/mod_professorview');
      // response.render('mod_professor', {session : request.session, data : result});
      });
}

exports.membersview = function(request, response) {
	sql = 'SELECT * FROM members';
    db.query(sql, function(error, result) {
      response.render('mod_members', {session : request.session, data : result});
      });
}

exports.members = function(request, response) {
  var name = request.body.name;
  console.log(name);
  var content = request.body.content;
  var tel = request.body.tel;
  var fax = request.body.fax;
  var email = request.body.email;
	sql = 'UPDATE members SET name = ?, content = ?, tel = ?, fax = ?, email = ? WHERE id = 1';
    db.query(sql, [name, content, tel, fax, email], function(error, result) {
      response.redirect('/mod_membersview');
      // response.render('mod_professor', {session : request.session, data : result});
      });
}
