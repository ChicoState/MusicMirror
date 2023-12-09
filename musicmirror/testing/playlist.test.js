import renderer from 'react-test-renderer';
import { findSongs, genPlaylist, getPlaylists, savePlaylist } from '../src/playlist';
import fetchMock from "jest-fetch-mock";
import 'whatwg-fetch'
import { describe } from 'yargs';
import { response } from 'express';

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

//findSongs
it('findSongs returns playlist object', async () => {
    const message = 'test1';
    fetch.mockResponse(JSON.stringify(responses.spotify_resp));
    sessionStorage.setItem("token", "test");
    const resp = await findSongs(message, 5);
    expect(JSON.stringify(resp)).toBe(JSON.stringify(responses.playlist));
});

it('findSongs returns n tracks', async () => {
    const message = 'test1';
    fetch.mockResponse(JSON.stringify(responses.spotify_resp));
    sessionStorage.setItem("token", "test");
    const resp = await findSongs(message, 5);
    expect(resp.songs[0].tracks.length).toBe(5);
});

it('findSongs splits input by newline', async () => {
    const message = 'test1\ntest2';
    fetch.mockResponse(JSON.stringify(responses.spotify_resp));
    sessionStorage.setItem("token", "test");
    const resp = await findSongs(message, 1);
    expect(JSON.stringify(resp)).toBe(JSON.stringify(responses.playlist2));
});

it('findSongs skips empty lines', async () => {
    const message = 'test1\n\ntest2\n ';
    fetch.mockResponse(JSON.stringify(responses.spotify_resp));
    sessionStorage.setItem("token", "test");
    const resp = await findSongs(message, 1);
    expect(JSON.stringify(resp)).toBe(JSON.stringify(responses.playlist2));
});

//genPlaylists
it('genPlaylists populates uri list', async () => {
    fetch.mockResponse(JSON.stringify({status: 200}));
    sessionStorage.setItem("token", "test");
    sessionStorage.setItem("user_id", "testid");
    const resp = await genPlaylist(responses.playlist2);
    expect(JSON.stringify(resp)).toBe(JSON.stringify(responses.uriList));
});

it('genPlaylists unsuccessful response', async () => {
    fetch.mockReject(new Error('mock error'));
    sessionStorage.setItem("token", "test");
    sessionStorage.setItem("user_id", "testid");
    expect(genPlaylist(responses.playlist2)).rejects.toThrow(Error);
});

it('genPlaylists returns undefined with empty input', async () => {
    fetch.mockResponse(JSON.stringify({status: 200}));
    sessionStorage.setItem("token", "test");
    sessionStorage.setItem("user_id", "testid");
    const resp = await genPlaylist({
        "title": "Music Mirror Playlist",
        "songs": []
    });
    expect(resp).toBe(undefined);
});

//getPlaylists
it('getPlaylists happy path', async () => {
    fetch.mockResponse(JSON.stringify(responses.getPlaylist));
    sessionStorage.setItem("token", "test");
    sessionStorage.setItem("user_id", "testid");
    expect(JSON.stringify(await getPlaylists())).toBe(JSON.stringify(responses.getPlaylist));
});

it('getPlaylists sad path', async () => {
    fetch.mockReject(new Error('mock error'));
    sessionStorage.setItem("token", "test");
    sessionStorage.setItem("user_id", "testid");
    expect(getPlaylists).rejects.toThrow(Error);
});

//savePlaylist
it('savePlaylists happy path', async () => {
    fetch.mockResponse(JSON.stringify({ status: 200 }));
    const resp = await savePlaylist(responses.playlist);
    expect(JSON.stringify(resp)).toBe(JSON.stringify({
        "playlist": {
            "p_name": "Music Mirror Playlist",
            "songs": [
                {
                    "title": "TEST DRIVE",
                    "artist": "Joji"
                }
            ]
        }
    }));
});

it('getPlaylists sad path', async () => {
    fetch.mockReject(new Error('mock error'));
    sessionStorage.setItem("token", "test");
    expect(savePlaylist(responses.playlist2)).rejects.toThrow(Error);
});

it('savePlaylists empty playlist', async () => {
    fetch.mockResponse(JSON.stringify({ status: 200 }));
    const resp = await savePlaylist({});
    expect(resp).toBe(undefined);
});

it('savePlaylists empty song array', async () => {
    fetch.mockResponse(JSON.stringify({ status: 200 }));
    const resp = await savePlaylist({
        "title": "Music Mirror Playlist",
        "songs": []
    });
    expect(resp).toBe(undefined);
});