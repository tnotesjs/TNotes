// 引入模块
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

// 创建虚拟数据库
var DummyDB = (function () {
    // 声明变量
    var DummyDB = {};
    var storage = [];
    var count = 1;

    // 查询数据库
    DummyDB.get = function (id) {
        if (id) {
            // 变量的数据类型转换
            id = (typeof id == 'string') ? Number(id) : id;
            // 存储变量
            for (var i in storage)
                if (storage[i].id == id) {
                    return storage[i];
                }
        } else {
            return storage;
        }
    };
    // 添加数据
    DummyDB.insert = function (data) {
        data.id = count++;
        storage.push(data);
        return data;
    };
    // 删除数据
    DummyDB.remove = function (id) {
        // 变量的数据类型转换
        id = (typeof id == 'string') ? Number(id) : id;
        // 删除操作
        for (var i in storage)
            if (storage[i].id == id) {
                // 删除数据
                storage.splice(i, 1);
                // 删除成功
                return true;
            }
        // 删除失败
        return false;
    };

    // 返回数据库
    return DummyDB;
})();

// 创建服务器
var app = express();

// 设置中间件
app.use(bodyParser.urlencoded({
    extended: false
}));

// 设置路由
app.get('/user', function (request, response) {
    response.send(DummyDB.get());
});

app.get('/user/:id', function (request, response) {
    response.send(DummyDB.get(request.params.id));
});

app.get('/addUser', function (request, response) {
    fs.readFile('addUser.html', function (error, data) {
        response.send(data.toString());
    });
});

app.post('/addUser', function (request, response) {
    // 声明变量
    var name = request.body.name;
    var pass = request.body.pass;

    // 添加数据
    if (name && pass) {
        response.send(DummyDB.insert({
            name: name,
            pass: pass
        }));
    } else {
        throw new Error('error');
    }
});


app.put('/user/:id', function (request, response) {
    // 声明变量
    var id = request.params.id;
    var name = request.body.name;
    var pass = request.body.pass;

    // 修改数据
    var item = DummyDB.get(id);
    item.name = name || item.name;
    item.pass = pass || item.pass;

    // 响应信息
    response.send(item);
});


app.delete('/user/:id', function (request, response) {
});

// 启动服务器
app.listen(52273, function () {
    console.log('服务器监听地址是 http://127.0.0.1:52273');
});