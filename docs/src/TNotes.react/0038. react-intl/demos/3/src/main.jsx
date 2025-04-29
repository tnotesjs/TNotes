import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { IntlProvider, FormattedMessage, FormattedDate } from 'react-intl';

const LOCALE_TYPE = {
  ZH_CN: 'zh-250102',
  EN: 'en',
}

const messages = {
  [LOCALE_TYPE.ZH_CN]: {
    "currentTime": "今天是 {date}",
  },
  [LOCALE_TYPE.EN]: {
    "currentTime": "Today is {date}",
  }
}

function App() {
  const [_locale, setL] = useState(LOCALE_TYPE.ZH_CN);

  return (
    <IntlProvider messages={messages[_locale]} locale={_locale} defaultLocale={LOCALE_TYPE.EN}>
      <div>
        <select value={_locale} onChange={(e) => setL(e.target.value)}>
          <option value={LOCALE_TYPE.ZH_CN}>中文</option>
          <option value={LOCALE_TYPE.EN}>English</option>
        </select>
        <p>
          <FormattedMessage id="currentTime" values={{ date: <FormattedDate value={new Date()} /> }} />
        </p>
      </div>
    </IntlProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);