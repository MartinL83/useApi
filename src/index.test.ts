import { Client } from './index';
import fetch from 'jest-fetch-mock';

describe('Test client', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('Endpoints', () => {
    it('should add endpoints', () => {
      const api = new Client({
        uri: 'https://api.tld',
      });

      api.addEndpoint({
        name: 'posts',
        path: '/posts/:id',
        method: 'GET',
      });

      api.addEndpoint({
        name: 'comments',
      });

      const endpoints = api.getEndpoint();
      const posts = api.getEndpoint('posts');
      const notExistingEndpoint = api.getEndpoint('__not_added__');

      expect(Object.keys(endpoints).length).toBe(2);
      expect(posts).toBeTruthy();
      expect(notExistingEndpoint).toBeFalsy();
    });
  });

  describe('Requests', () => {
    it('should call provided base URI', async () => {
      fetch.mockResponseOnce(JSON.stringify({ data: '12345' }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const api = new Client({
        uri: 'https://api.tld',
      });

      api.addEndpoint({
        name: 'root',
      });

      await api.request('root');

      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual('https://api.tld');
    });

    it('should add URL params to URI', async () => {
      fetch.mockResponseOnce(JSON.stringify({ data: '12345' }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const api = new Client({
        uri: 'https://api.tld',
      });

      api.addEndpoint({
        name: 'posts',
        path: '/posts/:id/:p',
      });

      await api.request('posts', {
        params: {
          id: 1,
          p: 'text',
        },
      });

      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual('https://api.tld/posts/1/text');
    });
  });

  describe('Handle response', () => {
    it('should return response', async () => {
      fetch.mockResponseOnce(JSON.stringify({ data: 'data' }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const api = new Client({
        uri: 'https://api.tld',
      });

      api.addEndpoint({
        name: 'posts',
        path: '/posts/:id',
      });

      const { response, error } = await api.request('posts', {
        params: {
          id: 1,
        },
      });

      expect(response).toStrictEqual({ data: 'data' });
      expect(error).toBeUndefined();
    });
  });

  describe('Handle error', () => {
    it('should return error', async () => {
      fetch.mockReject(new Error());

      const api = new Client({
        uri: 'https://api.tld',
      });

      api.addEndpoint({
        name: 'posts',
        path: '/posts/:id/:p',
      });

      const { response, error } = await api.request('posts', {
        params: {
          id: 1,
          p: 'text',
        },
      });

      expect(response).toBe(undefined);
      expect(error).toBeDefined();
    });
  });
});
