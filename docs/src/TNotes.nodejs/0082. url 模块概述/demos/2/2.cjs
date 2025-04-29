const myUrl = new URL('https://example.com/?name=John&age=30')
const params = myUrl.searchParams

// 获取参数
console.log(params.get('name')) // 输出：John
console.log(params.get('age')) // 输出：30

// 添加参数
params.append('city', 'New York')
console.log(myUrl.toString()) // 输出：https://example.com/?name=John&age=30&city=New+York

// 删除参数
params.delete('age')
console.log(myUrl.toString()) // 输出：https://example.com/?name=John&city=New+York

// 遍历参数
for (const [key, value] of params) {
  console.log(`${key}: ${value}`)
}
// 输出：
// name: John
// city: New York
