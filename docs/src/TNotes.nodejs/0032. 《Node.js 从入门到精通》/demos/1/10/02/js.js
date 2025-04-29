var fs = require("fs");
var read = fs.createReadStream('demo.txt');  //创建可读流
var write = fs.createWriteStream('凉州词.txt', {flags: "a"});//创建可写流
read.pipe(write);    //将可写流绑定到可读流
console.log("已完成")
