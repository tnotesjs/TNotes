
const os=require("os")
var free1=os.freemem()    //将剩余内存的单位转换为GB
var all1=os.totalmem()    //将总内存的单位转换为GB
var free=(free1/1024/1024/1024).toFixed(2)
var all=(all1/1024/1024/1024).toFixed(2)
rate=(free1/all1*100).toFixed(2)
console.log("总内存:"+all+"GB")
console.log("剩余内存:"+free+"GB")
console.log("内存使用率:"+rate+"%")
