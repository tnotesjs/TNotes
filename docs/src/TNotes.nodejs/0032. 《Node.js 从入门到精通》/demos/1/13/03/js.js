// 引入模块
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
// 创建服务器
http.createServer(function (request, response) {
    // 读取ejs模板文件
    fs.readFile('index.ejs', 'utf8', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(ejs.render(data, {
            No: '221#',
            orderTime: '2023-04-10 12:10',
            orderPrice: [{
                menu: "锅包肉",
                orderNo: '*1',
                price: '27.00',
            }, {
                menu: "可乐",
                orderNo: '*2',
                price: '7.00',
            }, {
                menu: "合计",
                orderNo: '',
                price: '34.00',
            }]
        }));
    });
}).listen(52273, function () {
    console.log('服务器监听端口是 http://127.0.0.1:52273');
});