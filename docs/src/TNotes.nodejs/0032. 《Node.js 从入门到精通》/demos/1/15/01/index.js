
// 引入模块
var mysql = require('mysql');
// 连接数据库
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
// 使用SQL查询语句
connection.query('USE Library');
connection.query('SELECT * FROM books', function(error, result, fields) {
    if(error) {
        console.log('查询语句有误！');
    } else {
        console.log(result);
    }
});
//关闭连接
connection.end(function (err) {
    if (err) {
        return;
    }
    console.log('[connection end] 关闭数据库连接!');
});