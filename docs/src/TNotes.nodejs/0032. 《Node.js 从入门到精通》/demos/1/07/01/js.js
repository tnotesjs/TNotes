var fs = require('fs');
//读取歌词文件
fs.readFile('song.txt', function(err, data) {
    if (err) {
        return console.log('读取歌词文件失败了');
    }
    data = data.toString();

    var lines = data.split('\n');

    // 遍历所有行，通过正则匹配里面的时间，解析出毫秒
    // 需要里面的时间和里面的内容
    var reg = /\[(\d{2})\:(\d{2})\.(\d{2})\]\s*(.+)/;

    for (var i = 0; i < lines.length; i++) {
        (function(index) {
            var line = lines[index];
            var matches = reg.exec(line);
            if (matches) {
                // 获取分
                var m = parseFloat(matches[1]);
                // 获取秒
                var s = parseFloat(matches[2]);
                // 获取毫秒
                var ms = parseFloat(matches[3]);
                // 获取定时器中要输出的内容
                var content = matches[4];
                // 将分+秒+毫秒转换为毫秒
                var time = m * 60 * 1000 + s * 1000 + ms;

                //使用定时器，让每行内容在指定的时间输出
                setTimeout(function() {
                    console.log(content);
                }, time);
            }
        })(i);
    }
});
