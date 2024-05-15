import React from 'react';
import { definePage } from '@music163/tango-boot';
import { Button } from '../components';

function App() {
  return (
    <div>
      <p>hello world</p>
      <Button onClick={() => tango.navigateTo('/')}>切换到首页</Button>
    </div>
  );
}

export default definePage(App);
