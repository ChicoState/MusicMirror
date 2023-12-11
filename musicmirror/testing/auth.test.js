/*
// import renderer from 'react-test-renderer';
import { checkCode, fetchProfile, generateCodeChallenge, generateCodeVerifier, getAccessToken, redirectToAuthCodeFlow, signOut } from '../src/auth';
import fetchMock from "jest-fetch-mock";
import 'whatwg-fetch'
import { TextDecoder, TextEncoder } from 'util';
const responses = require('./testResponses.json');


global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const crypto = require('crypto');

Object.defineProperty(global.self, "crypto", {
    value: {
      getRandomValues: (arr) => crypto.randomBytes(arr.length),
      subtle: {
        digest: (algorithm, data) => {
          return new Promise((resolve, reject) =>
            resolve(
              crypto.createHash(algorithm.toLowerCase().replace("-", ""))
                .update(data)
                .digest()
            )
          );
        },
      },
    },
});


class storageMock {
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
global.sessionStorage = new storageMock;
global.localStorage = new storageMock;

beforeAll(() => {
  delete window.location;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.location = {
      href: '',
  };
  fetchMock.enableMocks();
});
afterAll(() => {
  window.location = location;
  fetch.resetMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
  sessionStorage.clear();
  localStorage.clear();
})

//generateCodeVerifier
it('generateCodeVerifier correct length string', () => {
    expect(generateCodeVerifier(5).length).toBe(5);
});

it('generateCodeVerifier different string each time', () => {
    const first = generateCodeVerifier(10);
    const second = generateCodeVerifier(10);
    expect(first).not.toBe(second);
});

//generateCodeChallenge
it('generateCodeChallenge different string each time', () => {
    const first = generateCodeChallenge(10);
    const second = generateCodeChallenge(10);
    expect(first).not.toBe(second);
});

// //redirectToAuthCodeFlow
// it('redirect sets verifier when missing', () => {
//   sessionStorage.clear();
//   redirectToAuthCodeFlow('fake_cid');
//   console.log(sessionStorage.getItem("verifier"))
//   expect(jest.spyOn(global.sessionStorage, 'setItem')).toHaveBeenCalled();
// });

//redirectToAuthCodeFlow
it('redirect changes document location', () => {
    const url = 'http://localhost:3000';
    global.document.location = url;
    redirectToAuthCodeFlow('fake_cid')
    expect(global.document.location).not.toBe(url);
});

// //checkCode
// it('checkCode calls redirect when code missing', async () => {
//     jest.spyOn(redirectToAuthCodeFlow, 'call');
//     await checkCode();
//     expect(jest.spyOn(redirectToAuthCodeFlow, 'call')).toHaveBeenCalled();
// });

//getAccessToken
it('getAccessToken happy fetch response', async () => {
  sessionStorage.setItem("verifier", 'mock_verifier');
  fetch.mockResponse(JSON.stringify(responses.mock_token, {status: 200}));
  const res = await getAccessToken("mock_id", "mock_code");
  expect(res).toBe("mock_token");
});

it('getAccessToken sad fetch response', async () => {
  sessionStorage.setItem("verifier", 'mock_verifier');
  fetch.mockReject(new Error('mock error'));
  expect(getAccessToken("mock_id", "mock_code")).rejects.toThrow(Error);
});

it('getAccessToken !result.ok', async () => {
  sessionStorage.setItem("verifier", 'mock_verifier');
  fetch.mockResponse(JSON.stringify({mock: "mock"}, {status: 400}));
  expect(await getAccessToken("mock_id", "mock_code")).toBe(null);
});

//fetchProfile
it('fetchProfile happy path', async () => {
  fetch.mockResponse(JSON.stringify(responses.spotify_profile));
  sessionStorage.setItem("user_id", "fake_id");
  const spy = jest.spyOn(sessionStorage.setItem, 'call');
  const res = await fetchProfile("mock_token");
  expect(JSON.stringify(res)).toBe(JSON.stringify(responses.spotify_profile));
  expect(spy).not.toHaveBeenCalled();
});

it('fetchProfile sets user id when null', async () => {
  fetch.mockResponse(JSON.stringify(responses.spotify_profile));
  const res = await fetchProfile("mock_token");
  expect(sessionStorage.getItem("user_id")).not.toBe(null);
});

it('fetchProfile sad fetch path', async () => {
  sessionStorage.setItem("user_id", "fake_id");
  fetch.mockReject(new Error('mock error'));

  expect(getAccessToken("mock_id", "mock_code")).rejects.toThrow(Error);
});

//signout
it('signOut clears storages', async () => {
  sessionStorage.setItem("verifier", 'mock_verifier');
  localStorage.setItem("mock", "mock");
  signOut();
  expect(sessionStorage.getItem("verifier")).toBe(null);
  expect(localStorage.getItem("mock")).toBe(null);
});

it('signOut cleans url', async () => {
  window.location.href = responses.mockURL;
  console.log(responses.mockURL);
  signOut();
  expect(window.location.href).toBe("http://localhost:3000/");
});
*/