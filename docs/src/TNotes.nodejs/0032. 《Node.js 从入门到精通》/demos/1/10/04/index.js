const stream = require('stream');

var duplexStream = stream.Duplex();

duplexStream._read = function () {
    this.push('读取数据');
    this.push(null)
}

duplexStream._write = function (data, enc, next) {
    console.log(data.toString());
    next();
}

duplexStream.on('data', data => console.log(data.toString()));
duplexStream.on('end', data => console.log('读取完成'));

duplexStream.write('写入数据');
duplexStream.end();

duplexStream.on('finish', data => console.log('写入完成'));