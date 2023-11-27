import { defineServices } from '@music163/tango-boot';

// service 默认会提取响应中的 data 字段作为返回数据，此处需对不符合预期的原始请求响应做转换。
const formatRes = (res) => ({ data: { ...res } });

export default defineServices({
  list: {
    url: 'https://dog.ceo/api/breeds/list/all',
    formatter: formatRes,
  },

  getBreed: {
    url: 'https://dog.ceo/api/breed/:breed/images/random',
    formatter: formatRes,
  },
});
