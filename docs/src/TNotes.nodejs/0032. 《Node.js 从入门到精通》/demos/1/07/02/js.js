// 引入模块
var fs = require('fs');
// 声明变量
var data = '       春夜喜雨\n\t\t杜甫\n好雨知时节，当春乃发生。\n随风潜入夜，润物细无声。\n野径云俱黑，江船火独明。\n晓看红湿处，花重锦官城。';
// 使用模块
fs.writeFile('poems.txt', data, 'utf8', function (error) {
    if (error) {
        throw error;
    }
    console.log('异步写入文件完成');
});
fs.writeFileSync('newpoems.txt', data, 'utf8');
console.log('同步写入文件完成！');