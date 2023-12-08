import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpotifyProfile from '../src/components/SpotifyProfile'; 
import * as auth from '../src/auth.js';

jest.mock('../src/auth.js', () => ({
  ...jest.requireActual('../src/auth.js'),
  checkCode: jest.fn(),
}));

beforeEach(() => {
  auth.checkCode.mockClear();
});

test('should call auth.checkCode and update state in handleAuth', async () => {
  sessionStorage.setItem('loggedIn', 'false');

  render(<SpotifyProfile handleLogin={() => {}} />);

  userEvent.click(screen.getByRole('button', { name: 'Sign in with Spotify!' }));

  //tryna see if it's called ONCE
  await waitFor(() => {
    expect(auth.checkCode).toHaveBeenCalled();
  });

  //do i gotta anything else here?
});

test('should call handleLogin in componentDidMount', () => {
  const handleLoginMock = jest.fn();

  render(<SpotifyProfile handleLogin={handleLoginMock} />);

  expect(handleLoginMock).toHaveBeenCalledWith(false);
});

