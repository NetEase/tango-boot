import Index from './pages/index';
import Fun from './pages/fun';

const routes = [
  {
    path: '/',
    exact: true,
    component: Index,
  },
  {
    path: '/fun',
    exact: true,
    component: Fun,
  },
];

export default routes;
