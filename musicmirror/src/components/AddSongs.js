import '../styles/AddSongs.css';
import { useState } from 'react';
import { findSongs } from '../playlist';
import { Playlist } from './Playlist.js';
import { SpotifyProfile } from './SpotifyProfile.js';

let list = {
  title: "Music Mirror Playlist",
  songs: []
};

export async function getPlaylist() {
  console.log(`getPlaylist type: ${typeof(list)}`);
  return JSON.stringify(list);
}

function AddSongs(props) {
  const [message, setMessage] = useState('');
  const [showPlaylist, setShowPlaylist] = useState(false);
  

  const handleChange = event => {
    setMessage(event.target.value);
  };

  const handleClick = async() => {
    list = await findSongs(message);
    setShowPlaylist(true);
    console.log(`showplaylist = true : ${showPlaylist}`);
    //re-render playlist preview area (?)
    //Playlist();
  };
  console.log(`guh: ${showPlaylist}`);
  props.passData(showPlaylist);
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
    </div>
  );
}

export default AddSongs;