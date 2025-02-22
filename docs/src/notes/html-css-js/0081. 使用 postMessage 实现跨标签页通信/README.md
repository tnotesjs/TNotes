# [0081. 使用 postMessage 实现跨标签页通信](https://github.com/Tdahuyou/html-css-js/tree/main/0081.%20%E4%BD%BF%E7%94%A8%20postMessage%20%E5%AE%9E%E7%8E%B0%E8%B7%A8%E6%A0%87%E7%AD%BE%E9%A1%B5%E9%80%9A%E4%BF%A1)

<!-- region:toc -->
- [1. 💻 demos.1 - 使用 postMessage 实现跨标签页通信](#1--demos1---使用-postmessage-实现跨标签页通信)
<!-- endregion:toc -->
- `postMessage` API 可用于实现不同窗口、标签页或 iframe 之间的安全通信。它允许你向另一个浏览上下文（如新打开的窗口、iframe 等）发送消息，并可以接收来自这些上下文的消息。

## 1. 💻 demos.1 - 使用 postMessage 实现跨标签页通信

- 下面是一个简单的示例，演示如何使用 `postMessage` 在两个不同的浏览器标签页之间进行通信。这个例子分为两部分：一个页面用来发送消息，另一个页面用来接收消息。
- 发送消息的页面 (send.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Send Message</title>
  </head>
  <body>
    <h1>Send a Message to Another Tab</h1>
    <p>
      <button onclick="openWin()">Open Win</button>
    </p>
    <input type="text" id="message" placeholder="Type your message here..." />
    <button onclick="sendMessage()">Send Message</button>

    <script>
      let targetWindow
      function openWin() {
        // 使用 window.open 打开的窗口对象。
        // 将窗口对象存储在 targetWindow 变量中，方便后续获取目标窗口，并给它传递消息。
        targetWindow = window.open('receive.html', '_blank')
      }
      function sendMessage() {
        const message = document.getElementById('message').value

        // 发送消息到目标窗口
        targetWindow.postMessage({
            senderID: '__Tdahuyou__',
            message
        }, 'http://127.0.0.1:5500/')

        // * 表示所有域都 ok
        // targetWindow.postMessage(message, '*')
      }
      // 测试步骤：
      // 通过 open with live server 插件来打开 send.html
      // 假设打开的页面对应的域是 http://127.0.0.1:5500/
    </script>
  </body>
</html>
```

- 接收消息的页面 (receive.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Receive Message</title>
  </head>
  <body>
    <h1>Received Messages:</h1>
    <ul id="messages"></ul>

    <script>
      // 添加事件监听器以接收消息
      window.addEventListener('message', function (event) {
        // 检查消息来源是否可信
        // 如果消息不是来自预期的源，则忽略
        // 相当于做了一个身份验证
        if (event.origin !== 'http://127.0.0.1:5500' || event.data.senderID !== '__Tdahuyou__') return

        console.log('Received message:', event)
        // 处理接收到的消息
        const messageList = document.getElementById('messages')
        const newMessage = document.createElement('li')
        newMessage.textContent = event.data.message
        messageList.appendChild(newMessage)
      })
    </script>
  </body>
</html>
```

- **安全性**
  - 始终检查 `event.origin`，确保消息来自你信任的源。这可以防止恶意网站发送伪造消息。
  - 也可以通过其它自定义方案，加上身份验证的逻辑。
- **跨域限制**
  - `postMessage` 支持跨域通信，但需要正确设置 `targetOrigin` 参数，确保只将消息发送给正确的接收者。
- **性能考虑**
  - 频繁的跨窗口通信可能会对性能产生影响，特别是当涉及大量数据传输时。
