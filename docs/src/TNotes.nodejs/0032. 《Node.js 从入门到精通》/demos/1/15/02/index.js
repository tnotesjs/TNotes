// 引入模块
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

// 连接MySQL数据库
var connection = mysql.createConnection({
    host: 'localhost',
    port:"3306",
    user: 'root',
    password: 'root',
    database: 'Library'
});
// 判断数据库是否连接成功
connection.connect(function(err){
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  MySQL数据库连接成功!');
});

// 创建服务器
var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));

// 启动服务器
app.listen(52273, function () {
    console.log('服务器运行在 http://127.0.0.1:52273');
});
// 显示图书列表
app.get('/', function (request, response) {
    // 读取模板文件
    fs.readFile('book-list.html', 'utf8', function (error, data) {
        // 执行SQL语句
        connection.query('SELECT * FROM books', function (error, results) {
            // 响应信息
            response.send(ejs.render(data, {
                data: results
            }));
        });
    });
});
//删除数据
app.get('/delete/:id', function (request, response) {
    // 执行SQL语句
    connection.query('DELETE FROM books WHERE id=?', [request.params.id], function () {
        // 响应信息
        response.redirect('/');
    });
});

app.get('/insert', function (request, response) {
    // 读取模板文件
    fs.readFile('book-insert.html', 'utf8', function (error, data) {
        // 响应信息
        response.send(data);
    });
});
//添加数据
app.post('/insert', function (request, response) {
    // 声明body
    var body = request.body;
    // 执行SQL语句
    connection.query('INSERT INTO books (bookname, author, press) VALUES (?, ?, ?)', [
        body.bookname, body.author, body.press
    ], function () {
        // 响应信息
        response.redirect('/');
    });
});
//查询数据
app.get('/edit/:id', function (request, response) {
    // 读取模板文件
    fs.readFile('book-edit.html', 'utf8', function (error, data) {
        // 执行SQL语句
        connection.query('SELECT * FROM books WHERE id = ?', [
            request.params.id
        ], function (error, result) {
            // 响应信息
            response.send(ejs.render(data, {
                data: result[0]
            }));
        });
    });
});
//修改数据
app.post('/edit/:id', function (request, response) {
    // 声明body
    var body = request.body;
    // 执行SQL语句
    connection.query('UPDATE books SET bookname=?, author=?, press=? WHERE id=?', [body.bookname, body.author, body.press, request.params.id], function () {
        // 响应信息
        response.redirect('/');
    });
});