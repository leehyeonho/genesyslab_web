const express = require('express')
const app = express()

const passport = require('passport');
const request = require('request');
const path = require('path');

// const favicon = require('serve-favicon');
// app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
// Passport
app.use(passport.initialize());
app.use(passport.session());

//cookie,session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

//multer
const multer = require('multer');
var storage_gallery = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, './public/images/gallery/')
},
//파일이름 설정
filename: function (req, file, cb) {
cb(null, Date.now() + "-" + file.originalname)
}

})
var storage_mem = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, './public/images/members/')
},
//파일이름 설정
filename: function (req, file, cb) {
cb(null, Date.now() + "-" + file.originalname)
}

})
var storage_research = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, './public/images/research/')
},
//파일이름 설정
filename: function (req, file, cb) {
cb(null, Date.now() + "-" + file.originalname)
}

})
var storage_component = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, './public/images/component/')
},
//파일이름 설정
filename: function (req, file, cb) {
cb(null, Date.now() + "-" + file.originalname)
}

})
//파일 업로드 모듈
var upload_g = multer({ storage: storage_gallery })
var upload_m = multer({ storage: storage_mem })
var upload_re = multer({ storage: storage_research })
var upload_s = multer({ storage: storage_component })

// var options = {
//     host      : 'localhost',
//     port:3306,
//     user      : 'root',
//     password  : 'genesys11',
//     database  : 'genesys'
// };

// var options = {
//     host      : 'localhost',
//     port:3306,
//     user      : 'root',
//     password  : 'customlab11',
//     database  : 'genesys'
// };

var options = {
    host      : 'localhost',
    port:3306,
    user      : 'root',
    password  : '1234',
    database  : 'genesys'
};

var sessionStore = new MySQLStore(options);
app.use(cookieParser());
app.use(session({
  secret: 'g1e2n3e4s5y6s7',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 24000 * 60 * 60
  }
}));
app.use(bodyParser.urlencoded({extended: false}));

// ejs
// const ejs = require('ejs');

// app.use(favicon('./public/images/favicon.ico'));
const fs = require('fs');
const ejs = require('ejs');
var board = require('./public/js/board.js');
var user = require('./public/js/user.js');
var index = require('./public/js/index.js');
var admin = require('./public/js/admin.js');
var sub = require('./public/js/sub.js');
app.set('view engine', 'ejs');
app.set('views', './public/views');

// const mime = require('mime');
//
// var getDownloadFilename = require('./library/getDownloadFilename').getDownloadFilename;
//
// app.get('/images/:file_name', function(req, res, next) {
//     var upload_folder = '/images/';
//     var file = upload_folder + req.params.file_name;
//     try {
//     if (fs.existsSync(file)) { // 파일이 존재하는지 체크
//       var filename = path.basename(file); // 파일 경로에서 파일명(확장자포함)만 추출
//       var mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴
//
//       res.setHeader('Content-disposition', 'attachment; filename=' + getDownloadFilename(req, filename)); // 다운받아질 파일명 설정
//       res.setHeader('Content-type', mimetype); // 파일 형식 지정
//
//       var filestream = fs.createReadStream(file);
//       filestream.pipe(res);
//     } else {
//       res.send('해당 파일이 없습니다.');
//       return;
//     }
//   } catch (e) { // 에러 발생시
//     console.log(e);
//     res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
//     return;
//   }
// })



const port = 80

//index.html
app.get('/:nn', function(request, response) {
  index.index(request, response);
});

//sub
app.get('/sub.ejs', function(request, response) {
  sub.view(request, response);
  // response.render('sub', {session : request.session, tbl : request.query.tbl});
});

app.get('/board.ejs', function(request, response){
  board.home(request, response);
});

app.post('/write', function(request, response){
  board.write(request, response);
});

app.post('/delete', function(request, response){
  board.delete(request, response);
});

app.get('/board_write', function(request, response) {
  board.writeview(request, response);
});

app.post('/search', function(request, response) {
  board.search(request, response);
});

app.get('/board_delete', function(request, response){
  board.delete(request, response);
});

app.get('/board_view.ejs', function(request, response){
  board.view(request, response);
});

app.get('/board_editview.ejs', function(request, response){
  board.editView(request, response);
});

app.post('/login', function(request, response){
  user.login(request, response);
});

app.get('/logout', function(request, response){
  user.logout(request,response);
});

app.post('/upload', upload_g.array('imgFile'), function(request, response){
  if(request.files.length == 0) {
    if(request.body.tbl == 2) {
      response.redirect('/alert?key=nofile&tbl=2');
    } else {
      board.write(request, response);
    }
  } else
  board.upload(request, response);
});

// professor data form
app.get('/mod_professorview', function(request, response){
  admin.professorview(request, response);
});

// professor data transmit
app.post('/mod_professor', function(request, response){
  admin.professor(request, response);
});

// members mod form
app.get('/mod_membersmodview', function(request, response){
  admin.membersmodview(request, response);
});

// members seleceted data request
app.get('/mod_memselect', function(request, response){
  admin.memselect(request, response);
});

app.post('/mod_memselect', function(request, response){
  admin.memselect(request, response);
});

// members add data transmit
app.post('/mod_membersadd', upload_m.single('imgFile'), function(request, response){
  admin.membersadd(request, response);
});

app.post('/mod_membersmod', upload_m.single('imgFile'), function(request, response){
  admin.membersmod(request, response);
});

app.post('/mod_membersdel', function(request, response){
  admin.membersdel(request, response);
});

// research add data transmit
app.post('/mod_researchadd', upload_re.single('imgFile'), function(request, response){
  admin.researchadd(request, response);
});

// research selected data request
app.get('/mod_resselect', function(request, response){
  admin.resselect(request, response);
});

// research mod form
app.get('/mod_researchmodview', function(request, response){
  admin.researchmodview(request, response);
});

// research mod data transmit
app.post('/mod_researchmod', upload_re.single('imgFile'), function(request, response){
  admin.researchmod(request, response);
});

// research mod data transmit
app.post('/mod_researchdel', function(request, response){
  admin.researchdel(request, response);
});



app.get('/admin', function(request, response){
  if(request.session.isLogined == true) {
    response.render('admin', {session : request.session});
  } else {
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./adminlogin.html").pipe(response);
  }
});

app.get('/publication', function(request, response){
  sub.publication(request, response);
});

app.post('/mod_pubadd', function(request, response){
  admin.pubadd(request, response);
});

app.post('/mod_pubmod', function(request, response){
  admin.pubmod(request, response);
});

app.get('/mod_pubselect', function(request, response){
  admin.pubselect(request, response);
});

app.get('/mod_publicationmodview', function(request, response){
  admin.publicationmodview(request, response);
});

app.post('/mod_pubdel', function(request, response){
  admin.pubdel(request, response);
});

app.post('/adminPwMod', function(request, response){
  user.adminPwMod(request, response);
});

app.get('/adminPwModview', function(request, response){
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./adminPwModview.html").pipe(response);
});

app.get('/complete', function(request, response){
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./complete.html").pipe(response);
});

app.get('/alert', function(request, response){
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./alert.html").pipe(response);
});

app.get('/mod_membersaddview', function(request, response){
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./mod_membersaddview.html").pipe(response);
});

app.get('/mod_mainslideaddview', function(request, response){
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./mod_mainslideaddview.html").pipe(response);
});

app.get('/mod_mainslidemodview', function(request, response){
  admin.mainslidemodview(request, response);
});

app.post('/mod_mainslideadd', upload_s.single('imgFile'), function(request, response){
  admin.mainslideadd(request, response);
});

app.post('/mod_mainslidemod', upload_s.single('imgFile'), function(request, response){
  admin.mainslidemod(request, response);
});

app.post('/mod_mainslidedel', function(request, response){
  admin.mainslidedel(request, response);
});

app.get('/mod_mainslideselect', function(request, response){
  admin.mainslideselect(request, response);
});

app.get('/mod_publicationaddview', function(request, response){
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./mod_publicationaddview.html").pipe(response);
});

app.get('/mod_researchaddview', function(request, response){
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./mod_researchaddview.html").pipe(response);
});

app.get('/success', function(request, response){
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./success.html").pipe(response);
});

app.get('/whitespace', function(request, response){
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./whitespace.html").pipe(response);
});

app.get('/dev_notice', function(request, response){
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./dev_notice.html").pipe(response);
});

app.get('/favicon.ico', function(request, response){
});

app.get('/404_error', function(request, response){
  response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
  fs.createReadStream("./404_error.html").pipe(response);
});

app.post('/signup', function(request, response){
  user.signup(request, response);
});

app.use((req, res, next) => { // 404 처리 부분
  res.status(404).redirect('/404_error');
});

app.use((err, req, res, next) => { // 500 처리 부분
  res.status(500).redirect('/500_error');
});

app.listen(port, () => console.log(`GENESYS LAB. listening on port ${port}!`))
