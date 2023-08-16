# `request`

> A simple axios wrapper for better async data fetching

## Usage

```jsx
import request, { createService, createServices } from '@music163/request';
```

## request

```js
request(url, configs);

request.get(url, params, configs);

request.post(url, data, configs);
```

request config documentation: <https://axios-http.com/docs/req_config>

## createService

```js
const listAll = createService({
  url: '/api/listAll',
});

const list = await listAll(payload, configs);
```

## createServices

```js
const services = createServices({
  listAll: {
    url: '/api/listAll',
  },
});

const list = await services.listAll(payload, configs);
```
