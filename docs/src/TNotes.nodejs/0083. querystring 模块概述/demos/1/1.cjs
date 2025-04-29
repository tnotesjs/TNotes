const querystring = require('querystring')

// 定义一个 URL 字符串
const urlString =
  'https://example.com:8080/path/to/resource?name=John&age=30#section1'

const parsedUrl = new URL(urlString)

console.log(parsedUrl.search) // 输出：?name=John&age=30
console.log(parsedUrl.searchParams) // 输出：URLSearchParams { 'name' => 'John', 'age' => '30' }

const query = parsedUrl.search.slice(1)
const parsedQuery = querystring.parse(query)

console.log(query) // 输出：name=John&age=30
console.log(parsedQuery) // 输出：[Object: null prototype] { name: 'John', age: '30' }
console.log(querystring.stringify(parsedQuery)) // 输出：name=John&age=30
