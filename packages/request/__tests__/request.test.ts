import request from '../src';

it('should be ok', async () => {
  const data = await request('https://dog.ceo/api/breeds/list/all');
  expect(data.message).toBeTruthy();
});
