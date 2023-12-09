import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpotifyProfile from '../src/components/SpotifyProfile'; 
import AddSongs from '../src/components/AddSongs.js';
import * as auth from '../src/auth.js';
import '@testing-library/jest-dom';


/* SPOTIFYPROFILE TESTING */

//mock auth functionssss
jest.mock('../src/auth.js', () => ({
    ...jest.requireActual('../src/auth.js'),
    checkCode: jest.fn(),
    signIn: jest.fn()
}));

//clear the mock functions
beforeEach(() => {
    auth.checkCode.mockClear();
    auth.signIn.mockClear();
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

test('renders "Sign in" view when loggedIn is false', () => {
    sessionStorage.setItem('loggedIn', 'false');
  
    render(<SpotifyProfile handleLogin={() => {}} />);
  
    //we should have a sign in view with state false & loggedIn should be false
    expect(screen.getByText(/Looks like you haven't connected to Spotify yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in with Spotify!' })).toBeInTheDocument();
});
  
test('renders "Connected" view when loggedIn is true', () => {
    sessionStorage.setItem('loggedIn', 'true');
  
    render(<SpotifyProfile handleLogin={() => {}} />);
    
    //Should see logged in view and loggedIn state should be true
    expect(screen.getByText(/Spotify Connected!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
});

/* ADDSONGS TESTING */

