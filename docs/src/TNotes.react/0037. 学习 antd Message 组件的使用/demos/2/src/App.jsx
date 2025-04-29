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