const urlString =
  'https://example.com:8080/path/to/resource?name=John&age=30#section1'

const parsedUrl = new URL(urlString)
console.log(parsedUrl)
/* 
URL {
  hash: '#section1'
  host: 'example.com:8080',
  hostname: 'example.com',
  href: 'https://example.com:8080/path/to/resource?name=John&age=30#section1',
  origin: 'https://example.com:8080',
  password: '',
  pathname: '/path/to/resource',
  port: '8080',
  protocol: 'https:',
  search: '?name=John&age=30',
  searchParams: URLSearchParams { 'name' => 'John', 'age' => '30' },
  username: '',
}
*/

// 将解析后得到的 URL 对象重新转为字符串形式
console.log(parsedUrl.toString())
// 输出：https://example.com:8080/path/to/resource?name=John&age=30#section1

// 获取查询参数
console.log(parsedUrl.searchParams.get('name')) // 输出：John
console.log(parsedUrl.searchParams.get('age')) // 输出：30

// 修改查询参数
parsedUrl.searchParams.set('age', 35)

console.log(parsedUrl.toString())
// 输出：https://example.com:8080/path/to/resource?name=John&age=35#section1
// 会发现 age 的值已经被修改为 35 了
