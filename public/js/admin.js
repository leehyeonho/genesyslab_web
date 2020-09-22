var db = require('./connection.js');
const ejs = require('ejs');
var sql = '';

exports.researchview = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
	sql = 'SELECT * FROM research';
    db.query(sql, function(error, result) {
      response.render('mod_research', {session : request.session, data : result});
      });
}

exports.resselect = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
	var select = request.body.researchSelect;
	sql = 'SELECT * FROM research';
    db.query(sql, function(error, result) {
      response.render('mod_resselect', {session : request.session, data : result});
      });
}

exports.researchmodview = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
	var researchId = request.query.id;
	sql = 'SELECT * FROM research WHERE id = ?';
    db.query(sql, [researchId], function(error, result) {
      response.render('mod_researchmodview', {session : request.session, data : result});
      });
}

exports.researchmod = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
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
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
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
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
  var selected = request.query.selected;
	sql = 'DELETE FROM research WHERE id = ?';
    db.query(sql, [selected], function(error, result) {
			sql = 'SELECT * FROM research';
      db.query(sql, function(err, result_research) {
        response.render('mod_resselect', {session : request.session, data : result_research});
      });
      // response.render('mod_professor', {session : request.session, data : result});
      });
}

exports.professorview = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
	sql = 'SELECT * FROM professor';
    db.query(sql, function(error, result) {
			sql = 'SELECT tblname FROM research';
      db.query(sql, function(err, result_research) {
        response.render('mod_professor', {session : request.session, data : result, data_research : result_research});
      });
      });
}

exports.professor = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
  var name = request.body.name;
	var content = request.body.content;
  var edu = request.body.edu;
	var exp = request.body.exp;
  var tel = request.body.tel;
  var fax = request.body.fax;
  var email = request.body.email;
	sql = 'UPDATE professor SET name = ?, content = ?, tel = ?, fax = ?, email = ?, edu = ?, exp = ? WHERE id = 1';
    db.query(sql, [name, content, tel, fax, email, edu, exp], function(error, result) {
      response.redirect('/mod_professorview');
      // response.render('mod_professor', {session : request.session, data : result});
      });
}

exports.memselect = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
	var select = request.body.membersSelect;
	sql = 'SELECT * FROM candidate WHERE position = 1';
    db.query(sql, function(error, result1) {
			sql = 'SELECT * FROM candidate WHERE position = 2';
				db.query(sql, function(error, result2) {
					sql = 'SELECT * FROM candidate WHERE position = 3';
						db.query(sql, function(error, result3) {
							response.render('mod_memselect', {session : request.session, can1 : result1, can2 : result2, can3 : result3});
							});
					});
      });
}

exports.membersmodview = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
	var membersId = request.query.id;
	sql = 'SELECT * FROM candidate WHERE id = ?';
    db.query(sql, [membersId], function(error, result) {
      response.render('mod_membersmodview', {session : request.session, data : result});
      });
}

exports.membersadd = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
  var name = request.body.name;
	var email = request.body.email;
  var resArea = request.body.resArea;
  var occu = request.body.occu;
  var year = request.body.year;
	var id = request.body.membersSelect;

	sql = 'INSERT INTO candidate(name, email, researchArea, occu, year, position, img) values(?,?,?,?,?,?,?)';
    db.query(sql, [name, email, resArea, occu, year, id, request.file.path.substring(6)], function(error, result) {
      response.redirect('/mod_membersaddview');
      // response.render('mod_professor', {session : request.session, data : result});
      });
}

exports.membersmod = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
	var name = request.body.name;
	var email = request.body.email;
  var resArea = request.body.resArea;
  var occu = request.body.occu;
  var year = request.body.year;
	var pos = request.body.pos;
  var img = request.file.path.substring(6);
	sql = 'UPDATE candidate SET name = ?, email = ?, researchArea = ?, occu = ?, year = ?, img = ? WHERE position = ?';
    db.query(sql, [name, email, resArea, occu, year, request.file.path.substring(6), pos], function(error, result) {
      response.redirect('/success');
      // response.render('mod_professor', {session : request.session, data : result});
      });
}

exports.membersdel = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
  var selected = request.query.selected;
	sql = 'DELETE FROM candidate WHERE id = ?';
    db.query(sql, [selected], function(error, result) {
			sql = 'SELECT * FROM candidate';
      db.query(sql, function(err, result_members) {
				sql = 'SELECT * FROM candidate WHERE position = 1';
					db.query(sql, function(error, result1) {
						sql = 'SELECT * FROM candidate WHERE position = 2';
							db.query(sql, function(error, result2) {
								sql = 'SELECT * FROM candidate WHERE position = 3';
									db.query(sql, function(error, result3) {
										response.render('mod_memselect', {session : request.session, data : result_members, can1 : result1, can2 : result2, can3 : result3});
										});
								});
						});
      });
      // response.render('mod_professor', {session : request.session, data : result});
      });
}

exports.pubadd = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
  var content = request.body.content;
	var year = request.body.year;
  var reg = request.body.reg;
  var author = request.body.author;
	var id = request.body.pubSelect;
	if (id == "1") {
		id = "journals";
	} else if (id == "2") {
		id = "presentations";
	} else if (id == "3") {
		id = "patent";
	}
	sql = 'INSERT INTO publication(content, year, reg, author, tblname) values(?,?,?,?,?)';
    db.query(sql, [content, year, reg, author, id], function(error, result) {
      response.redirect('/mod_publicationaddview');
      // response.render('mod_professor', {session : request.session, data : result});
      });
}

exports.publicationmodview = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
	var pubId = request.query.id;
	sql = 'SELECT * FROM publication WHERE id = ?';
    db.query(sql, [pubId], function(error, result) {
      response.render('mod_publicationmodview', {session : request.session, data : result});
      });
}

exports.pubmod = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
	var content = request.body.content;
	var year = request.body.year;
  var reg = request.body.reg;
  var author = request.body.author;
	var id = request.body.id;
	sql = 'UPDATE publication SET content = ?, year = ?, reg = ?, author = ? WHERE id = ?';
    db.query(sql, [content, year, reg, author, id], function(error, result) {
      response.redirect('/success');
      // response.render('mod_professor', {session : request.session, data : result});
      });
}

exports.pubselect = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
	var select = request.body.membersSelect;
	sql = "SELECT * FROM publication WHERE tblname = 'journals'";
    db.query(sql, function(error, result1) {
			sql = "SELECT * FROM publication WHERE tblname = 'presentations'";
				db.query(sql, function(error, result2) {
					sql = "SELECT * FROM publication WHERE tblname = 'patent'";
						db.query(sql, function(error, result3) {
							response.render('mod_pubselect', {session : request.session, pub1 : result1, pub2 : result2, pub3 : result3});
							});
					});
      });
}

exports.pubdel = function(request, response) {
	if(!request.session.isLogined) {
		response.redirect("/alert?key=notlogin");
	}
  var selected = request.query.selected;
	sql = 'DELETE FROM publication WHERE id = ?';
    db.query(sql, [selected], function(error, result) {
			sql = 'SELECT * FROM publication';
      db.query(sql, function(err, result_pub) {
				sql = "SELECT * FROM publication WHERE tblname = 'journals'";
					db.query(sql, function(error, result1) {
						sql = "SELECT * FROM publication WHERE tblname = 'presentations'";
							db.query(sql, function(error, result2) {
								sql = "SELECT * FROM publication WHERE tblname = 'patent'";
									db.query(sql, function(error, result3) {
										response.render('mod_pubselect', {session : request.session, data : result_pub, pub1 : result1, pub2 : result2, pub3 : result3});
										});
								});
						});
      });
      // response.render('mod_professor', {session : request.session, data : result});
      });
}
