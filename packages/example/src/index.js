// import React from 'react';
import { runApp } from '@music163/tango-boot';

runApp({
  boot: {
    mountElement: document.querySelector('#root'),
    qiankun: false,
  },
});
