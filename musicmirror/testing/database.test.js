import fetchMock from "jest-fetch-mock";
import { createUser, emailCheck, getUsername, getMMPlaylists, deleteUser } from '../src/database';
import 'whatwg-fetch'

const responses = require('./testResponses.json');

beforeAll(() => {
    fetchMock.enableMocks();
});
  
beforeEach(() => {
    fetch.resetMocks();
});

//emailCheck
it('emailCheck happy path (email exists in db)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ email: 'test123@test.com' }));
    
    expect(await emailCheck('test123@test.com')).toBe(true);
})

it('emailCheck sad path (email not in db)', async () => {
    fetch.mockResponse(JSON.stringify({mock: "mock"}, {status: 400}));
    
    expect(await emailCheck('test123@test.com')).toBe(false);
})

it('emailCheck sad path (fetch throws)', async () => {
    fetchMock.mockRejectOnce(new Error('mock error'));
    
    expect(emailCheck('test123@test.com')).rejects.toThrow(Error);
})

//createUser
it('createUser happy path', async () => {
    const userData = {
        name: "name",
        password: "password",
        email: "email",
    };
    fetchMock.mockResponseOnce(JSON.stringify(userData));
    
    expect(JSON.stringify(await createUser("name", "password", "email"))).toBe(JSON.stringify(userData));
})

it('createUser sad path (post throws)', async () => {
    fetchMock.mockRejectOnce(new Error("mock error"));
    
    expect(createUser("name", "password", "email")).
        rejects.toThrow(Error);
})

it('createUser sad path (bad request)', async () => {
    fetch.mockResponseOnce('{}', { status: 500, headers: { 'content-type': 'application/json' } });

    
    expect(await createUser("name", "password", "email")).toBe(null);
})

//getUsername
it('getUsername happy path', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({name: "testname", password: "password"}));
    
    expect(JSON.stringify(await getUsername("email", "password", ))).toBe(JSON.stringify("testname"));
})

it('getUsername sad path (password mismatch)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({name: "testname", password: "password1"}));
    
    expect(await getUsername("email", "password")).toBe(undefined);
})

it('getUsername sad path (post throws)', async () => {
    fetchMock.mockRejectOnce(new Error("mock error"));
    
    expect(getUsername("email", "password")).
        rejects.toThrow(Error);
})

it('getUsername sad path (bad request)', async () => {
    fetch.mockResponseOnce('{}', { status: 500, headers: { 'content-type': 'application/json' } });

    
    expect(await getUsername("email", "password")).toBe(null);
})

//getMMPlaylists
it('getMMPlaylists happy path', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({playlists: ["p1", "p2"]}));
    
    expect(JSON.stringify(await getMMPlaylists("mockid"))).toBe(JSON.stringify(["p1", "p2"]));
})

it('getMMPlaylists no playlists', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({playlists: []}));
    
    expect(JSON.stringify(await getMMPlaylists("mockid"))).toBe(undefined);
})

it('getMMPlaylists sad path (post throws)', async () => {
    fetchMock.mockRejectOnce(new Error("mock error"));
    
    expect(getMMPlaylists("mockid")).
        rejects.toThrow(Error);
})

it('getMMPlaylists sad path (bad request)', async () => {
    fetch.mockResponseOnce('{}', { status: 500, headers: { 'content-type': 'application/json' } });

    expect(await getMMPlaylists("mockid")).toBe(null);
})

//deleteUser
it('deleteUser happy path', async () => {
    const userData = {
        name: "name",
        password: "password",
        email: "email",
    };
    fetchMock.mockResponseOnce(JSON.stringify(userData));    
    expect(JSON.stringify(await deleteUser("email"))).toBe(JSON.stringify(userData));
})

it('deleteUser sad path (user not in database)', async () => {
    fetch.mockResponseOnce('{}', { status: 404, headers: { 'content-type': 'application/json' } });
    
    expect(JSON.stringify(await deleteUser("email"))).toBe(undefined);
})

it('deleteUser sad path (post throws)', async () => {
    fetchMock.mockRejectOnce(new Error("mock error"));
    
    expect(deleteUser("email")).
        rejects.toThrow(Error);
})

it('deleteUser sad path (bad request)', async () => {
    fetch.mockResponseOnce('{}', { status: 500, headers: { 'content-type': 'application/json' } });

    expect(await deleteUser("email")).toBe(undefined);
})