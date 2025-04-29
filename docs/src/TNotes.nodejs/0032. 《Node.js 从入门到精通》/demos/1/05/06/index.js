// // 引入events模块
// var events = require('events');
// // 生成EventEmitter对象
// var custom = new events.EventEmitter();
// function listener() {
//     console.log('触发监听事件！');
// }
// // 添加监听事件event
// custom.on('event', listener);
// // 主动触发监听事件event
// custom.emit('event');
// console.log(custom.eventNames()); //输出移除前的监听事件名称
// custom.removeListener('event',listener) //移除event事件
// console.log(custom.eventNames());//输出移除后的监听事件名称

// 引入events模块
var events = require('events');
// 生成EventEmitter对象
var custom = new events.EventEmitter();
function listener() {
    console.log('触发监听事件！');
}
// 添加监听事件event
custom.on('event', listener);
/*  多次添加同一个事件 */
custom.on('event', listener);
custom.on('event', listener);
custom.on('event', listener);
// 主动触发监听事件event
custom.emit('event');
console.log(custom.eventNames()); //输出移除前的监听事件名称
custom.removeListener('event',listener); //移除event事件
console.log(custom.eventNames());//输出移除后的监听事件名称
