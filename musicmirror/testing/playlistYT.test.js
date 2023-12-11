import React from 'react';
import { render, fireEvent, waitFor, act, screen} from '@testing-library/react';
//import { screen } from "@testing-library/jest-dom";
import PlaylistYT from '../src/components/PlaylistYT';
import '@testing-library/jest-dom';
import { genPlaylist } from '../src/playlist';
//import { act } from 'react-dom/test-utils';

const mockList = {
    title: 'Mock Playlist',
    songs: [
      {
        tracks: [
          {
            title: 'Song 1',
            artist: 'Artist 1',
          },
        ],
      },
      {
        tracks: [
          {
            title: 'Song 2',
            artist: 'Artist 2',
          },
        ],
      },
    ],
  };

  test('componentDidUpdate updates state correctly', () => {
    const mockSearch = 2;
  
    const { rerender } = render(<PlaylistYT list={mockList} search={mockSearch} />);
  
    const setStateSpy = jest.spyOn(PlaylistYT.prototype, 'setState');
  
    const newMockSearch = 3;
    rerender(<PlaylistYT list={mockList} search={newMockSearch} />);
  
    expect(setStateSpy).toHaveBeenCalledWith(
      { playlist: mockList, search: newMockSearch + 1, currentTitle: "Mock Playlist" },
      expect.any(Function)
    );
  
    expect(setStateSpy).toHaveBeenCalledTimes(1);
  
    setStateSpy.mockRestore();
  });

test('handleBlur sets isEditing to false', () => {
      const playlistSpotInstance = new PlaylistYT();
    
      playlistSpotInstance.state = {
            playlist: {},
            isEditing: false,
            currentTitle: "New Music Mirror Playlist",
            selectedSong: {},
            selectedIndex: null,
            search: 1,
      };

      const onTitleChangeMock = jest.fn();
      playlistSpotInstance.onTitleChange = onTitleChangeMock;

      act(() => {
        playlistSpotInstance.handleBlur();
      });
  
      expect(playlistSpotInstance.state.isEditing).toBe(false);
      expect(onTitleChangeMock).toHaveBeenCalledWith('New Music Mirror Playlist');
});

test('handleChange updates currentTitle in state', () => {
    
    const playlistSpotInstance = new PlaylistYT();

    jest.spyOn(playlistSpotInstance, 'setState').mockImplementation((newState) => {
        playlistSpotInstance.state = { ...playlistSpotInstance.state, ...newState };
    });
    
    playlistSpotInstance.state = {
        playlist: {},
        isEditing: false,
        currentTitle: "New Music Mirror Playlist",
        selectedSong: {},
        selectedIndex: null,
        search: 1,
    };

    playlistSpotInstance.handleChange({ target: { value: 'New Title' } });

    expect(playlistSpotInstance.state.currentTitle).toBe('New Title'); 
});
