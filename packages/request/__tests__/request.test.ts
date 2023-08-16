/**
 * API documentation
 * @see https://dog.ceo/dog-api/documentation/
 */

import request, { createService, createServices } from '../src';

it('should request', async () => {
  const data = await request('https://dog.ceo/api/breeds/list/all');
  expect(data.message).toBeTruthy();
});

it('should request with payload', async () => {
  const data = await request.get('https://animechan.xyz/api/random/anime', {
    title: 'naruto',
  });
  expect(data.anime).toBeTruthy();
});

it('should formatter', async () => {
  const data = await request.get('https://dog.ceo/api/breeds/list/all', null, {
    formatter: (res) => {
      console.log(res);
      return {
        data: res.message,
      };
    },
  });
  expect(data.data).toBeTruthy();
});

it('should createService', async () => {
  const listAll = createService({
    url: 'https://dog.ceo/api/breeds/list/all',
  });
  const data = await listAll();
  expect(data.message).toBeTruthy();
});

it('should createServices', async () => {
  const services = createServices({
    listAll: {
      url: 'https://dog.ceo/api/breeds/list/all',
    },
  });
  const data = await services.listAll();

  expect(data.message).toBeTruthy();
});
