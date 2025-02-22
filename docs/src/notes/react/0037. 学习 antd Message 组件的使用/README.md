# [0037. 学习 antd Message 组件的使用](https://github.com/Tdahuyou/react/tree/main/0037.%20%E5%AD%A6%E4%B9%A0%20antd%20Message%20%E7%BB%84%E4%BB%B6%E7%9A%84%E4%BD%BF%E7%94%A8)

<!-- region:toc -->
- [1. 🔗 Message 全局提示](#1--message-全局提示)
- [2. 💻 demos.1 - 了解 Message 的基本使用](#2--demos1---了解-message-的基本使用)
- [3. 💻 demos.2 - 理解 contextHolder 的作用](#3--demos2---理解-contextholder-的作用)
- [4. 🔗 来自官方文档的回复：为什么 message 不能获取 context、redux 的内容和 ConfigProvider 的 locale/prefixCls/theme 等配置？](#4--来自官方文档的回复为什么-message-不能获取-contextredux-的内容和-configprovider-的-localeprefixclstheme-等配置)
<!-- endregion:toc -->

## 1. 🔗 Message 全局提示

- https://ant-design.antgroup.com/components/message-cn

## 2. 💻 demos.1 - 了解 Message 的基本使用

```jsx
import React from 'react';
import { Button, message } from 'antd';
const App = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const info = () => {
    messageApi.info('Hello, Ant Design!');
  };
  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={info}>
        Display normal message
      </Button>
    </>
  );
};
export default App;
```

- ![](assets/2024-12-02-16-03-07.png)

## 3. 💻 demos.2 - 理解 contextHolder 的作用

```jsx
// 写法1：不用 {contextHolder}
import React from 'react';
import { message, ConfigProvider, Button } from 'antd';

const App = () => {
  const showMessage = () => {
    message.success('This is a success message');
  };

  return (
    <ConfigProvider theme={{ token: { colorSuccess: '#008c8c' } }}>
      <Button onClick={showMessage}>Show Message</Button>
    </ConfigProvider>
  );
};

export default App;

// 写法2：使用 {contextHolder}
// import React from 'react';
// import { message, ConfigProvider, Button } from 'antd';

// const App = () => {
//   const [messageApi, contextHolder] = message.useMessage();

//   const showMessage = () => {
//     messageApi.success('This is a success message');
//   };

//   return (
//     <ConfigProvider theme={{ token: { colorSuccess: '#008c8c' } }}>
//       {contextHolder}
//       <Button onClick={showMessage}>Show Message</Button>
//     </ConfigProvider>
//   );
// };

// export default App;
```

- 写法1：不用 `{contextHolder}`，最终渲染的消息颜色还是使用默认值，我们在 `ConfigProvider` 中配置的颜色不生效。
- 写法2：使用 `{contextHolder}`，此时 `ConfigProvider` 中的配置才生效。
- ![](assets/2024-12-02-16-28-03.png)

## 4. 🔗 来自官方文档的回复：为什么 message 不能获取 context、redux 的内容和 ConfigProvider 的 locale/prefixCls/theme 等配置？

- ![](assets/2024-12-02-16-31-49.png)



