import { genPlaylist } from '../playlist';
import '../styles/Playlist.css';
import AddSongs from './AddSongs.js'
import { useState, useEffect } from 'react';

export function Playlist() {
  const [playlist, setPlaylist] = useState();

    useEffect(() => {
      const getData = async () => {
        let obj = await AddSongs.getPlaylist();
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
          <ol className="">
              {playlist.songs.map((song) => (
                <li className="">{song.title} | {song.artist} | {song.album} | {song.length}</li>
              ))}
            </ol>
        </div>
        <button className="btn btn-secondary" onClick={() => genPlaylist(playlist)}>Create Playlist</button>
      </div>
    );
  }
}

export default Playlist;