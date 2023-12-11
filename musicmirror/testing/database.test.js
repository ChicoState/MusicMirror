import fetchMock from "jest-fetch-mock";
import { createUser, emailCheck } from '../src/database';
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