num=0 //定义变量，用来记录执行次数
// 引入events模块
var events = require('events');
// 生成 EventEmitter 对象
exports.timer = new events.EventEmitter();
// 触发监听事件tick
setInterval(function () {
    num+=1
    exports.timer.emit('tick',num);
}, 1000);