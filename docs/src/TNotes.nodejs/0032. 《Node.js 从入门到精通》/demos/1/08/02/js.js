
const os = require("os")
var alltime = os.uptime()    //总秒数
var sec = alltime % 60         //剩余秒数（不足1分钟的秒数）
var allmin = parseInt(alltime / 60)  //总分钟数
var min = allmin % 60
var hour = parseInt(allmin / 60)
console.log("当前计算机运行了" + alltime + "秒")
console.log("转换后为：%d时%d分%d秒", hour, min, sec)
