import { defineServices } from '@music163/tango-boot';

export default defineServices({
  list: {
    url: 'https://dog.ceo/api/breeds/list/all',
  },
});
