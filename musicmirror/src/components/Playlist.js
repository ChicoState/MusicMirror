import { genPlaylist } from '../playlist';
import '../styles/Playlist.css';
import {getPlaylist} from './AddSongs.js'
import { useState, useEffect } from 'react';

export function Playlist() {
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
            <div className="song_card d-flex">
              <div className="preview flex-fill">
                <img className="play"></img>
                <img className="stop"></img>
              </div>
              <div className="details flex-fill">
                <h4>{song.title}</h4>
                <div className="d-flex justify-content-between">
                  <p>{song.artist}</p>
                  <p>|</p>
                  <p>{song.album}</p>
                  <p>|</p>
                  <p>{song.length}</p>
                </div>
              </div>
              <div className="options flex-fill">
                <img className="next"></img>
                <img className="remove"></img>
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