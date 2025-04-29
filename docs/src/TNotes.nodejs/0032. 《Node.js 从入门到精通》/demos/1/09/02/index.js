// var a = 0;
// function fooA(x) {
//     console.log(x)
// }
// function timer(time) {
//     setTimeout(function () {
//         a=6
//     }, time);
// }
// console.log(a);
// timer(3000);
// fooA(a);


var a = 0
function fooA(x) {
    console.log(x)
}
function timer(time, callback) {
    setTimeout(function () {
        a = 6
        callback(a);
    }, time);
}
//调用
console.log(a)
timer(3000,fooA)

