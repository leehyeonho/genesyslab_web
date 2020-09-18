var db = require('./connection.js');
const ejs = require('ejs');
const bcrypt = require('bcrypt-nodejs');
// var session = require('express-session');
var sql = '';

exports.login = function (request, response) {
    var user_id = "admin";
    var password = request.body.password;
    db.query('select * from user_info where user_id = ?', [user_id], function (err, result) {
        if (err) {
          console.log('err :' + err);
        } else {
            if (result.length === 0) {
  	    console.log("id 없음.");
              response.json({success: false, msg: '존재하지 않습니다.'})
            } else {
  	      bcrypt.compare(password, result[0].password, function(err, res) {
  		if (res) { // 비교 성공
  		 request.session.user_id = result[0].user_id;
  		 request.session.user_name = result[0].user_name;
  		 request.session.user_tell = result[0].user_tell;
  		 request.session.isLogined = true;
  		 console.log("login success, user_id : " + request.session.user_id);
                   request.session.save(function(){
                     response.render('admin', {session : request.session});
  		 });
  		 //response.render('index', {session : request.session});
                  } else { // 비교 실패
  		    console.log("password incorrected");
  		    response.redirect('//fail?key=loginfail');
  		  }
  });
            }
          }
        });

}

exports.kakaoLogin = function (request, response) {
  var user_id = request.body.username;
  var password = request.body.password;
  db.query('select * from user_info where user_id = ?', [user_id], function (err, result) {
      if (err) {
        console.log('err :' + err);
      } else {
          if (result.length === 0) {
	    console.log("id 없음.");
            response.json({success: false, msg: '존재하지 않습니다.'})
          } else {
	      bcrypt.compare(password, result[0].password, function(err, res) {
		if (res) { // 비교 성공
		 request.session.user_id = result[0].user_id;
		 request.session.user_name = result[0].user_name;
		 request.session.user_tell = result[0].user_tell;
		 request.session.isLogined = true;
		 console.log("login success, user_id : " + request.session.user_id);
                 request.session.save(function(){
		   response.redirect('/');
		 });
		 //response.render('index', {session : request.session});
                } else { // 비교 실패
		    console.log("password incorrected");
		    response.redirect('/');
		  }
});
          }
        }
      });

}

exports.signup = function ( request, response ){
  var user = request.body;

  sql = 'select * from user_info where user_id = ?';
  db.query(sql, [user.user_id], function(err, isExist) {
    if(err) {
      console.log("err : " + err);
    } else {
      if(isExist.length == 0){
          bcrypt.hash(user.password, null, null, function(err, hash) {
            sql = 'insert into user_info(user_id, password, user_name, user_tell, reg_date) values (?, ?, ?, ? , now())';
            db.query(sql, [user.user_id, hash, user.user_name, user.user_tell], function(err, result) {
            if(err) {
              console.log("err : " + err);
            } else {
              console.log("회원가입 성공");
              response.redirect('/complete');
            }
            });
          });
      } else {
        console.log("이미 가입된 ID입니다.");
      }
    }
  });
}

exports.logout = function ( request, response ){
  request.session.destroy(function(){
    request.session;
  });
  response.redirect('/');
}

exports.adminPwMod = function(request,response) {
  var admin = request.body;
  var id = "admin";
  db.query("select * from user_info where user_id = ?", [id], function (err, result) {
    bcrypt.compare(admin.presentpw, result[0].password, function(err, res) {
      if (res) { // 비교 성공
        bcrypt.hash(admin.password, null, null, function(err, hash) {
          sql = 'UPDATE user_info SET password = ? WHERE user_id = ?';
          db.query(sql, [hash, id], function(err, result) {
          if(err) {
            console.log("err : " + err);
          } else {
            console.log("admin 비밀번호 변경 성공");
            response.redirect('/alert?key=admodsuccess');
          }
          });
        });
                } else { // 비교 실패
        console.log("password incorrected");
        response.redirect('/alert?key=admodfail');
      }
    });
  });
}
