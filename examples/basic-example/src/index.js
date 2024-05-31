import { runApp } from '@music163/tango-boot';
import routes from './routes';
import './stores';
import './services';

// window.__TANGO_DESIGNER__ = {
//   version: '1.0.0',
// };

runApp({
  boot: {
    mountElement: document.querySelector('#root'),
    qiankun: false,
  },
  router: {
    type: 'hash',
    config: routes,
  },
});
