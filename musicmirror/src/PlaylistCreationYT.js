// In your component where you want to show the Create Playlist button and form

import React, { useState } from 'react';
import * as youtube from './youtube'; // Import your youtube functions

function PlaylistCreationYT() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await youtube.createPlaylist(sessionStorage.getItem('youtubeAccessToken'),title, description);
      //setMessage('Playlist created successfully!');
      setTitle('');
      setDescription('');
      setShowForm(false);
      // Additional logic after creating the playlist
    } catch (error) {
      setMessage('Error creating playlist');
    }
  };

  return (
    <div>
      {sessionStorage.getItem('loggedInYT') === 'true' && !showForm && (
        <button onClick={handleCreateClick}>Create Playlist</button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Playlist Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Playlist Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default PlaylistCreationYT;
