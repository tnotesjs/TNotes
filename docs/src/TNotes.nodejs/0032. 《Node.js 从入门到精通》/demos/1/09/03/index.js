var fs = require("fs") //引入fs模块
//定义异步函数，用来判断是否为文件夹
async function isDir(path) {
    return new Promise((resolve, reject)=> {
        fs.stat(path, (err,stats)=> {
            if (err) { //如果发生错误，则返回
                return
            }
            if (stats.isDirectory()) { //如果是文件夹返回true
                resolve(true);
            }else { //否则返回false
                resolve(false);
            }
        })
    })
}

var path = "D:\\测试文件夹" //指定当前路径
var dirArr = [] //用来记录遍历得到的所有文件夹名称
fs.readdir(path, async (err, data) => {
    if (err) {
        return
    }
    //遍历指定目录
    for (var i = 0; i < data.length; i++) {
        //异步调用isDir函数，判断是否为文件夹
        if (await isDir(path + '/' + data[i])) {
            dirArr.push(data[i]) //将文件夹的名称添加到数组中
        }
    }
    console.log(dirArr) //输出所有文件夹名称
})