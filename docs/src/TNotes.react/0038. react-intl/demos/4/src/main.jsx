import React, { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {
  IntlProvider,
  FormattedMessage,
  defineMessages,
  useIntl,
} from 'react-intl'

// 推荐
const msg = defineMessages({
  welcome: {
    id: 'app.welcome',
    defaultMessage: 'Welcome, {name}!',
    description: '欢迎用户的消息',
  },
  goodbye: {
    id: 'app.goodbye',
    defaultMessage: 'Goodbye, {name}!',
    description: '告别用户的消息',
  },
})

// 不推荐
const msg2 = {
  welcome: {
    id: 'app.welcome',
    defaultMessage: 'Welcome, {name}!',
    description: '欢迎用户的消息',
  },
  goodbye: {
    id: 'app.goodbye',
    defaultMessage: 'Goodbye, {name}!',
    description: '告别用户的消息',
  },
}

function Greeting({ name }) {
  const intl = useIntl()
  return (
    <>
      {/* 在组件中使用 */}
      <div>
        <FormattedMessage {...msg.welcome} values={{ name }} />
        <br />
        <FormattedMessage {...msg.goodbye} values={{ name }} />
      </div>
      <hr />
      <div>
        <FormattedMessage {...msg2.welcome} values={{ name }} />
        <br />
        <FormattedMessage {...msg2.goodbye} values={{ name }} />
      </div>
      <hr />
      <hr />
      {/* 在函数中使用 */}
      <div>
        {intl.formatMessage(msg.welcome, { name })}
        <br />
        {intl.formatMessage(msg.goodbye, { name })}
      </div>
      <hr />
      <div>
        {intl.formatMessage(msg2.welcome, { name })}
        <br />
        {intl.formatMessage(msg2.goodbye, { name })}
      </div>
    </>
  )
}

// -------------------------------------------------------------------------
// #region Q&A
// -------------------------------------------------------------------------
// 🤔 msg、msg2 有何区别？
// 答：单从 demo 的功能来看，用哪个其实都 ok，没啥区别。

// 🔍 在 node_modules/react-intl/index.js 中可以查看到 defineMessages 的实现源码：
// function defineMessages(msgs) {
//   return msgs;
// }
// 会发现它其实就是将传入的对象直接返回，并没有做任何的特殊处理。
// 不过还是推荐使用 defineMessages 来定义消息。
// 1. 可以获得更好的 IDE 支持，比如快速跳转到对应的类型声明文件查看消息结构信息。
//    export interface MessageDescriptor {
//        id?: MessageIds;
//        description?: string | object;
//        defaultMessage?: string | MessageFormatElement[];
//    }
// 2. 如果使用的是 .ts 来写，还能获取更友好的类型提示。
// 3. 工具链支持，配套的 react-intl-cli 库在处理的时候，可以自动扫描并提取 defineMessages 定义的消息到翻译文件中，若使用 msg2 的写法，则无法提取。
// 4. 可读性相对更好一些。
// -------------------------------------------------------------------------
// #endregion Q&A
// -------------------------------------------------------------------------

// 包含了所有的翻译信息的模块
const localeMessages = {
  en: {
    'app.welcome': 'Welcome, {name}!',
    'app.goodbye': 'Goodbye, {name}!',
  },
  zh: {
    'app.welcome': '欢迎，{name}！',
    'app.goodbye': '再见，{name}！',
  },
}

function App() {
  const [locale, setLocale] = useState('en') // 可以根据需要动态设置
  const messages = localeMessages[locale]

  return (
    <IntlProvider locale={locale} messages={messages}>
      <div>
        <select value={locale} onChange={(e) => setLocale(e.target.value)}>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
        <Greeting name="Tdahuyou" />
      </div>
    </IntlProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
