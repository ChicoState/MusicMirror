import '../styles/Playlist.css';
import {getPlaylist} from './AddSongs.js'
import { useState, useEffect } from 'react';


// let playlist = {
//   title: "Music Mirror Playlist",
//   songs: []
// };
// async function setPlaylist() {
//   playlist = JSON.parse(await getPlaylist);
//   console.log("out of getPlaylist");
//   setWaiting(false);
//   // waiting = false;
// }

export function Playlist() {
  // const [isWaiting, setWaiting] = useState(true);
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
    // setWaiting(false);
  // setPlaylist();
  // let str = getPlaylist();
  // let playlist = JSON.parse(str);
  // console.log("out of getPlaylist");
  // console.log(`playlist: ${playlist} str: ${str}`);

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
        <button className="btn btn-secondary">Create Playlist</button>
      </div>
    );
  }
}

export default Playlist;