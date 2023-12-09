import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AddSongs from '../src/components/AddSongs.js';

test('handleClick works when logged in', async () => {
    //simulating getting the session storage by using prototype of it.
    //this will make it so it's like the user is logged in
    jest.spyOn(window.sessionStorage.__proto__, 'getItem').mockReturnValueOnce('true');
  
    //mock alert function
    const mockAlert = jest.fn();
    
    //render component with alert func and handleMsg prop
    render(<AddSongs alert={mockAlert} handleMsg={() => {}} />);
  
    //click ittttt
    fireEvent.click(screen.getByText(/Find Songs/i));
  
    //check if alert went off and if props are updating
    expect(mockAlert).toHaveBeenCalledWith('Searching...', 'info');
});  

test('handleClick works when not logged in', async () => {
    jest.spyOn(window.sessionStorage.__proto__, 'getItem').mockReturnValueOnce('false');
  
    const mockAlert = jest.fn();
    
    render(<AddSongs alert={mockAlert} handleMsg={() => {}} />);
  
    fireEvent.click(screen.getByText(/Find Songs/i));
  
    expect(mockAlert).toHaveBeenCalledWith(
      'You must log in to another service before searching for songs',
      'info'
    );
});

//tests if text area state is being updated when input given
test('state updates with input', () => {
    render(<AddSongs />);

    fireEvent.change(screen.getByLabelText(/Search for songs/i), {
        target: { value: "sosa chief keef" },
    });

    const result = screen.getByText(/Find Songs/i);

    expect(result).toBeDefined();
});
