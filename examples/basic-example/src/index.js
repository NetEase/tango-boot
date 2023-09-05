import { runApp } from '@music163/tango-boot';
import routes from './routes';
import './stores';
import './services';

runApp({
  boot: {
    mountElement: document.querySelector('#root'),
    qiankun: false,
  },
  routes,
});
