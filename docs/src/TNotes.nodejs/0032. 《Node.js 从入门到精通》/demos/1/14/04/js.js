// 引入模块
var fs = require('fs');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 创建服务器
var app = express();
// 设置中间件
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// 设置路由配置
app.get('/', function (request, response) {
    if (request.cookies.auth) {
        response.send('<h1 style="color:red;text-align: center">登录成功</h1>');
    } else {
        response.redirect('/login');
    }
});

app.get('/login', function (request, response) {
    fs.readFile('login.html', function (error, data) {
        response.send(data.toString());
    });
});

app.post('/login', function (request, response) {
    // 创建cookie
    var user = request.body.user;
    var pass = request.body.pass;


    // 判断登录是否成功
    if (user == 'mingrisoft' && pass == '123456') {
        // 登录成功
        response.cookie('auth', true);
        response.redirect('/');
    } else {
        // 登录失败
        response.redirect('/login');
    }
});

// 启动服务器
app.listen(52273, function () {
    console.log('服务器监听地址是 http://127.0.0.1:52273');
});