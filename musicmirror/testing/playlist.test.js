import renderer from 'react-test-renderer';
import { findSongs } from '../src/playlist';
import fetchMock from "jest-fetch-mock";
import 'whatwg-fetch'
import { describe } from 'yargs';

const responses = require('./testResponses.json');

class sessionStorageMock {
    constructor() {
      this.store = {};
    }
  
    clear() {
      this.store = {};
    }
  
    getItem(key) {
      return this.store[key] || null;
    }
  
    setItem(key, value) {
      this.store[key] = String(value);
    }
  
    removeItem(key) {
      delete this.store[key];
    }
}
  
global.sessionStorage = new sessionStorageMock;

beforeAll(() => {
    fetchMock.enableMocks();
});
  
beforeEach(() => {
    fetch.resetMocks();
});

it('returns playlist object', async () => {
    const message = 'test1';
    fetch.mockResponse(JSON.stringify(responses.spotify_resp));
    sessionStorage.setItem("token", "test");
    const resp = await findSongs(message, 5);
    expect(JSON.stringify(resp)).toBe(JSON.stringify(responses.playlist));
});

it('returns n tracks', async () => {
    const message = 'test1';
    fetch.mockResponse(JSON.stringify(responses.spotify_resp));
    sessionStorage.setItem("token", "test");
    const resp = await findSongs(message, 5);
    expect(resp.songs[0].tracks.length).toBe(5);
});

it('splits input by newline', async () => {
    const message = 'test1\ntest2';
    fetch.mockResponse(JSON.stringify(responses.spotify_resp));
    sessionStorage.setItem("token", "test");
    const resp = await findSongs(message, 1);
    expect(JSON.stringify(resp)).toBe(JSON.stringify(responses.playlist2));
});

it('skips empty lines', async () => {
    const message = 'test1\n\ntest2\n ';
    fetch.mockResponse(JSON.stringify(responses.spotify_resp));
    sessionStorage.setItem("token", "test");
    const resp = await findSongs(message, 1);
    expect(JSON.stringify(resp)).toBe(JSON.stringify(responses.playlist2));
});
