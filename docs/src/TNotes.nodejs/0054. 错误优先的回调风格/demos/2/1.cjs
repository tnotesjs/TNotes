function divide(a, b, callback) {
  if (b === 0) {
    // 操作失败时，传递错误对象
    return callback(new Error('除数不能为 0'))
  }
  // 操作成功时，第一个参数为 null，第二个参数为结果
  callback(null, a / b)
}

divide(10, 2, (err, result) => {
  if (err) {
    console.error('发生错误:', err.message)
    return
  }
  console.log('结果:', result) // 输出: 结果: 5
})

divide(10, 0, (err, result) => {
  if (err) {
    console.error('发生错误:', err.message) // 输出: 发生错误: 除数不能为 0
    return
  }
  console.log('结果:', result)
})
