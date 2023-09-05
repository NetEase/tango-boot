# TangoBoot

TangoBoot is a frontend framework that serves the NetEase Tango Low-Code applications. It provides standard data requests, state management, and routing solutions, as well as generic runtime utility functions, allowing developers to generate Single Page Applications through less codes.

Documentation: <https://netease.github.io/tango/docs/boot/intro/>

## Usage

```jsx
import { runApp, definePage, defineStore, defineServices } from '@music163/boot';
```

### defineStore

define a reactive store object

```jsx
import { defineStore } from '@music163/tango-boot';

defineStore(
  {
    number: 10,

    add() {
      this.number++;
    },

    decrement() {
      this.number--;
    },
  },
  'counter',
);
```

### defineServices

define a collection of async functions

```jsx
import { defineServices } from '@music163/tango-boot';

export default defineServices({
  list: {
    url: 'https://dog.ceo/api/breeds/list/all',
  },
});
```

### definePage

define a observable page component

```jsx
import React from 'react';
import { definePage } from '@music163/tango-boot';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>{tango.stores.counter.number}</h1>
        <button onClick={tango.stores.counter.add}>+</button>
        <button onClick={tango.stores.counter.decrement}>-</button>
      </div>
    );
  }
}

export default definePage(App);
```

### runApp

```jsx
runApp({
  boot: {
    mountElement: document.querySelector('#root'),
  },
  routes: [
    {
      path: '/',
      exact: true,
      component: IndexPage,
    },
  ],
});
```
