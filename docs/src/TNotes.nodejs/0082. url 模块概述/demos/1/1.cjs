const url = require('url')

// 定义一个 URL 字符串
const urlString =
  'https://example.com:8080/path/to/resource?name=John&age=30#section1'

// 解析 URL 字符串为对象
const parsedUrl = url.parse(urlString, true) // 第二个参数为 true 时，会将查询参数解析为对象
console.log(parsedUrl)

// 输出结果：是一个 URL 对象
/*
Url {
  auth: null,
  hash: '#section1',
  host: 'example.com:8080',
  hostname: 'example.com',
  href: 'https://example.com:8080/path/to/resource?name=John&age=30#section1'
  path: '/path/to/resource?name=John&age=30',
  pathname: '/path/to/resource',
  port: '8080',
  protocol: 'https:',
  query: [Object: null prototype] { name: 'John', age: '30' }, // 查询参数被解析为对象
  search: '?name=John&age=30',
  slashes: true,
}
*/

// 将 URL 对象格式化为字符串
const formattedUrl = url.format(parsedUrl)
console.log(formattedUrl)
// 输出：https://example.com:8080/path/to/resource?name=John&age=30#section1
