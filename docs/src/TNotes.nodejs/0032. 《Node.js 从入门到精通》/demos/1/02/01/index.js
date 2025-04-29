//加载http模块
var http = require('http');
console.log("请打开浏览器，输入地址 http://127.0.0.1:3000/");
//创建http服务器，监听网址127.0.0.1 端口号3000
http.createServer(function(req, res) {
    res.end('Hello World!');
    console.log("right");
}).listen(3000,'127.0.0.1');
