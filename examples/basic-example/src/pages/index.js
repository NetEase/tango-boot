import React from 'react';
import { definePage } from '@music163/tango-boot';
import { Layout, Button, Card } from 'antd';
import { Input } from '../components';

class App extends React.Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh', gap: 24, padding: 24 }}>
        <Card title="计数器">
          <h1>{tango.stores.counter.number}</h1>
          <button onClick={tango.stores.counter.add}>+</button>
          <button onClick={tango.stores.counter.decrement}>-</button>
        </Card>
        <Card title="双向绑定 & 状态控制">
          <Input tid="input1" defaultValue="hello world" />
          <div>输入框的值为：{tango.page.input1?.value}</div>
          <Button
            onClick={() => {
              tango.page.input1?.setValue('hello');
            }}
          >
            setValue
          </Button>
        </Card>
        <Card title="异步请求">
          <Button
            onClick={async () => {
              await tango.stores.dogs?.listAllBreeds();
            }}
          >
            加载dogs列表
          </Button>
          <div>
            <div>
              {Object.keys(tango.stores.dogs?.list || {}).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={async () => {
                    await tango.stores.dogs?.getRandomImage(item);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            {tango.stores.dogs?.image ? (
              <div>
                <img src={tango.stores.dogs?.image} alt="breed image" />
              </div>
            ) : (
              <div>点击上面的 dog name，加载图片</div>
            )}
          </div>
        </Card>
      </Layout>
    );
  }
}

export default definePage(App);
