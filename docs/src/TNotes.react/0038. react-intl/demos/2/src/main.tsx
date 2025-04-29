import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider, defineMessages, useIntl, injectIntl, IntlShape } from 'react-intl';

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
});

interface GreetingProps {
  name: string;
  intl: IntlShape;
}

function Greeting({ name, intl }: GreetingProps) {
  const intl2: IntlShape = useIntl();

  // 通过 injectIntl 和 useIntl() 获取到的 intl 是同一个对象。
  // console.log(intl === intl2); // true

  return (
    <>
      <div>
        {intl2.formatMessage(msg.welcome, { name })}
        <br />
        {intl2.formatMessage(msg.goodbye, { name })}
      </div>
      <hr />
      <div>
        {intl.formatMessage(msg.welcome, { name })}
        <br />
        {intl.formatMessage(msg.goodbye, { name })}
      </div>
    </>
  );
}

const localeMessages = {
  en: {
    'app.welcome': 'Welcome, {name}!',
    'app.goodbye': 'Goodbye, {name}!',
  },
  zh: {
    'app.welcome': '欢迎，{name}！',
    'app.goodbye': '再见，{name}！',
  },
};

type Locale = keyof typeof localeMessages;

function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const messages = localeMessages[locale];

  const GreetingContainer = injectIntl(Greeting); // 注入 intl 对象

  return (
    <IntlProvider locale={locale} messages={messages}>
      <div>
        <select value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
        <GreetingContainer name="Tdahuyou" />
      </div>
    </IntlProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
