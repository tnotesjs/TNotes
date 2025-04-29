//引入第三方模块
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// 引入自定义模块
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//创建服务器对象
var app = express();

var identityKey = 'skey';
var users = require('./users').items;

var findUser = function(name, password){
  return users.find(function(item){
    return item.name === name && item.password === password;
  });
};


// 对服务器进行设置
app.set('views', path.join(__dirname, 'views'));

var ejs=require("ejs");
app.engine(".html",ejs.__express);
app.set("view engine","html")

//设置中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: identityKey,
  secret: 'mingrisoft',  // 用来对session id相关的cookie进行签名
  store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
  saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
  resave: false,  // 是否每次都重新保存会话，建议false
  cookie: {
    maxAge: 1000 * 1000  // 有效期，单位是毫秒
  }
}));



//GET请求，设置用户登录状态
app.get('/', function(req, res, next){
  var sess = req.session;
  var loginUser = sess.loginUser; //记录登录用户
  var isLogined = !!loginUser;    //将登录用户变量转化为对应布尔值

  res.render('index', { //渲染index模板文件，设置登录状态和登录用户
    isLogined: isLogined,
    name: loginUser || ''
  });
});
//POST请求，判断用户是否能够登录成功
app.post('/login', function(req, res, next){
  var sess = req.session;
  var user = findUser(req.body.name, req.body.password);

  if(user){
    req.session.regenerate(function(err) {
      if(err){
        return res.json({ret_code: 2, ret_msg: '登录失败'});
      }
      req.session.loginUser = user.name;
      res.json({ret_code: 0, ret_msg: '登录成功'});
    });
  }else{
    res.json({ret_code: 1, ret_msg: '账号或密码错误'});
  }
});
//GET请求，退出登录时，清空Session
app.get('/logout', function(req, res, next){
  req.session.destroy(function(err) {
    if(err){
      res.json({ret_code: 2, ret_msg: '退出登录失败'});
      return;
    }
    res.clearCookie(identityKey);
    res.redirect('/');
  });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
