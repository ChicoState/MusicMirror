import renderer from 'react-test-renderer';
import { findSongs } from '../src/playlist';
import fetchMock from "jest-fetch-mock";
import 'whatwg-fetch'

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
    fetch.mockResponses([
        JSON.stringify(responses.spotify_resp)
    ]);
    sessionStorage.setItem("token", "test");
    const resp = await findSongs(message, 5);
    expect(JSON.stringify(resp)).toBe(JSON.stringify(responses.playlist));
});
