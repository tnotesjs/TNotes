// 引入模块
var http = require('http');
// 创建服务器，网页自动跳转
http.createServer(function (request, response) {
    response.writeHead(302, { 'Location': 'https://www.mingrisoft.com/' });
    response.end();
}).listen(52273, function () {
    console.log('服务器监听地址在 http://127.0.0.1:52273');
});