
// 模拟同步代码块内出现异常
let syncError = () => {
    throw new Error('同步异常')
}

// 模拟异步代码块内出现异常
let asyncError = () => {
    setTimeout(function () {
        throw new Error('异步异常')
    }, 100)
}

// 捕获同步异常
try {
    syncError()
} catch (e) {
    console.log(e.message)
}
console.log('异常被捕获')

/*
   常规的捕获异步异常的三种方法（不能正常捕获）
 */
// ——————————第1种方法——————————
// try {
//     asyncError()
// } catch (e) {
//     /*异常无法被捕获,导致进程退出*/
//     console.log(e.message)
// }

// ——————————第2种方法——————————
// new Promise((resolve, reject) => {
//     asyncError()
// })
//     .then(() => {
//     })
//     .catch((e) => {
//         /*异常无法被捕获,导致进程退出*/
//         console.log(e.message)
//     })

// ——————————第3种方法——————————
// (async function () {
//     try {
//         await asyncError()
//     } catch (e) {
//         console.log(e.message)//处理异常
//     }
// })()

// process方式捕获异步异常
process.on('uncaughtException', function (e) {
    console.log(e.message)//处理异常
});
asyncError()

// domain方式捕获异步异常
let domain = require('domain')
let d = domain.create()
d.on('error', function (e) {
    console.log(e.message)//处理异常
})
d.run(asyncError)
