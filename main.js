const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const passport = require('passport');
const request = require('request');
// const favicon = require('serve-favicon');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
// Passport
app.use(passport.initialize());
app.use(passport.session());

//cookie,session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
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
app.set('view engine', 'ejs');
app.set('views', './public/views');



const port = 3000

//index.html
app.get('/', function(request, response) {
  index.index(request, response);
});

//sub
app.get('/sub.ejs', function(request, response) {
  response.render('sub', {session : request.session, tbl : request.query.tbl});
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

app.get('/board_write.ejs', function(request, response) {
  response.render('board_write', {session: request.session, tbl : request.query.tbl});

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

app.post('/signup', function(request, response){
  user.signup(request, response);
});



app.get('/:page', function(request, response){
  if(request.params.page == '/favicon.ico') {
  } else {
    response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream("./" + request.params.page + ".html").pipe(response);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
