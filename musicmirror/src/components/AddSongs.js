import '../styles/AddSongs.css';
import { useState } from 'react';
import { findSongs } from '../playlist';
import { Playlist } from './Playlist.js'

let list = {
  title: "Music Mirror Playlist",
  songs: []
};

export function getPlaylist() {
  console.log(typeof(list.songs));
  return list;
}

function AddSongs() {
  const [message, setMessage] = useState('');
  const [showPlaylist, setShowPlaylist] = useState(false);
  

  const handleChange = event => {
    setMessage(event.target.value);
  };

  const handleClick = event => {
    list = findSongs(message);
    setShowPlaylist(true);

    //re-render playlist preview area (?)
    //Playlist();
  };

  return (
    // add path to form-handler inside action attribute
    <div className="container p-4 col">
    <div className="">
      <label className="form-label" htmlFor="fileInput">
        <h3 className="mb-2">Click to upload files:</h3>
        <img className="p-2" src="./images/upload.png" alt="upload area" />
        <input className="upload" type="file" id="fileInput" name="fileInput" accept="audio/*" multiple />
      </label>
    </div>
    <div className="">
      <label className="form-label" htmlFor="textInput">
        <h3 className="mt-5 mb-0">Or enter new songs here:</h3>
      </label>
      <textarea className="form-control" id="textInput" rows="5" onChange={handleChange} value={message} placeholder="Type each song on its own line."></textarea>
    </div>
    <button className="mt-5 btn btn-secondary" onClick={handleClick}>Find Songs</button>
    {showPlaylist && <Playlist />}
  </div>
  );
}

export default AddSongs;