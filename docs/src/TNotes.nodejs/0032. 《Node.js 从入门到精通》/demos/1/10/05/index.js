const Stream = require('stream');

class TransformStream extends Stream.Transform {
    constructor() {
        super()
    }

    _transform(data, encoding, callback) {
        //将写入的数据进行反转
        const res = data.toString().split('').reverse().join('');
        this.push(res) //输出反转后的数据
        callback()
    }
}

var transformStream = new TransformStream();

transformStream.on('data', data => console.log(data.toString()))
transformStream.on('end', data => console.log('读取完成'));

transformStream.write('写入数据');
transformStream.end()

transformStream.on('finish', data => console.log('写入完成'));