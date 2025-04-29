// 引入events模块
var events = require('events');
// 生成EventEmitter对象
var custom = new events.EventEmitter();
// 添加监听事件tick
custom.once('tick', function () {
    console.log('执行指定事件！');
});
// 主动触发监听事件tick
custom.emit('tick');
