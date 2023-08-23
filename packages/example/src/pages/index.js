import React from 'react';
import { definePage } from '@music163/tango-boot';
import { Button, Divider } from 'antd';
import { Input } from '../components';

class App extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h1>{tango.stores.counter.number}</h1>
          <button onClick={tango.stores.counter.add}>+</button>
          <button onClick={tango.stores.counter.decrement}>-</button>
          <Divider />
        </div>
        <div>
          <Input id="input1" defaultValue="hello world" />
          <div>{tango.getStoreValue('currentPage.input1.value')}</div>
          <Button
            onClick={() => {
              tango.setStoreValue('currentPage.input1.value', 'hello');
            }}
          >
            setValue
          </Button>
        </div>
      </div>
    );
  }
}

export default definePage(App);
