const fs = require('fs');
const read= fs.createReadStream("凉州词.txt", {highWaterMark: 25});
read.setEncoding("utf8")   //设置编码格式
read.on('data', function (chunk) {
    console.log(chunk.toString());
    read.pause();
    setTimeout(function () {
        read.resume();
    }, 1000);
});
read.on("close",function(){
    console.log("读取完毕");
})
