import { genPlaylist } from '../playlist';
import '../styles/Playlist.css';
import {getPlaylist} from './AddSongs.js'
import { useState, useEffect } from 'react';
import { findSongs } from '../playlist';


let newSong = {};


export function Playlist() {

  // Allows the user to re-do an individual song search
  const [message, setMessage] = useState('');
  
  const handleChange = event => {
    setMessage(event.target.value);
  };

  const handleClick = async() => { // NEEDS WORK, DOESN'T UPDATE PLAYLIST, ALSO MAYBE SINGLE MODAL W/ VARS BETTER FOR THIS
    console.log("handleclick");
    newSong = await findSongs(message);
  };

  // Determines whether a playlist is ready for display
  const [playlist, setPlaylist] = useState();

  useEffect(() => {
    const getData = async () => {
      let obj = await getPlaylist();
      let list = JSON.parse(obj);
      setPlaylist(list);
    }
    getData();
  }, []);
  console.log("out of getPlaylist");

  if(!playlist){
    return(
      <div className="Playlist-container mt-5">
      <div className="list-container">
        <h3>Add songs to preview playlist</h3>
      </div>
    </div>
    );
  }

  if(Object.keys(playlist.songs).length > 0){
    console.log("in if statement");
    return (
      <div className="Playlist-container mt-5">
        <div className="list-container">
          <h3>{playlist.title}</h3>
  
          {playlist.songs.map((song) => (
            <div className="song-card">

              {/* This is what you see in the playlist */}
              <div className="song-preview d-flex">
                <div className="preview flex-fill">
                  <img className="play"></img>
                  <img className="stop"></img>
                </div>
                <div className="details flex-fill" role="button" data-bs-toggle="modal" data-bs-target="#song-details">
                  <h4>{song.title}</h4>
                  <p>{song.artist}</p>
                </div>
                <div className="options flex-fill">
                  <img className="next"></img>
                  <img className="remove"></img>
                </div>
              </div>

              {/* This pops up when you click on the song */}
              <div id="song-details" className="modal fade" tabindex="-1" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <div className="modal-card">
                        <div className="modal-card-header d-flex">
                          <h4>{song.title}</h4>
                          <p className="song-length">({song.length})</p>
                          <button className="" type="button"><img /></button>
                        </div>
                        <p>Artist: {song.artist}</p>
                        <p>Album: {song.album}</p>
                      </div>
                      <div className="search-container">
                        <label className="form-label" htmlFor="textInput">
                          <h5 className="mt-5 mb-0">Refine Search:</h5>
                        </label>
                        <div className="searchbox d-flex">
                          <textarea className="form-control flex-grow-1" id="textInput" rows="1" onChange={handleChange} value={message} placeholder="" />
                          <button className="btn btn-secondary" onClick={handleClick}>Q</button>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-success" data-bs-dismiss="modal">Confirm Selection</button>
                      <button type="button" className="btn btn-danger">Remove Song</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
        <button className="btn btn-secondary" onClick={() => genPlaylist(playlist)}>Confirm Playlist</button>
      </div>
    );
  }
}

export default Playlist;