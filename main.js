const express = require('express')
const app = express()

const passport = require('passport');
const request = require('request');

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
//파일 업로드 모듈
var upload_g = multer({ storage: storage_gallery })
var upload_m = multer({ storage: storage_mem })
var upload_re = multer({ storage: storage_research })


// var options = {
//     host      : 'localhost',
//     port:3306,
//     user      : 'root',
//     password  : 'genesys11',
//     database  : 'genesys'
// };
var options = {
    host      : 'localhost',
    port:3306,
    user      : 'root',
    password  : 'genesys11',
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



const port = 80

//index.html
app.get('/', function(request, response) {
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

app.post('/upload', upload.single('imgFile'), function(request, response){
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

app.get('/favicon.ico', function(request, response){
});

app.get('/404_error', function(request, response){
  response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
  fs.createReadStream("./404_error.html").pipe(response);
});

app.get('/500_error', function(request, response){
  response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
  fs.createReadStream("./500_error.html").pipe(response);
});

app.use((req, res, next) => { // 404 처리 부분
  res.status(404).redirect('/404_error');
});

app.use((err, req, res, next) => { // 500 처리 부분
  res.status(500).redirect('/500_error');
});

app.listen(port, () => console.log(`GENESYS LAB. listening on port ${port}!`))
