const fs = require("fs")
fs.stat("demo", function (err, stats) {
    if(err){
        console.log("获取文件夹信息失败")
    }
    else{
        console.log(stats)
    }
})
