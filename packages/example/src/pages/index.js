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
