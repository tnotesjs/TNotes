
var fs=require("fs");               //引入fs模块
var path="text\\story.txt"        // 定义story.txt文件的路径
text=fs.readFileSync(path,"utf8")  //读取文件
console.log(text)                  //显示文件内容
