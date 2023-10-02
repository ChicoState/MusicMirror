import testlist from '../testlist.json';
import '../styles/Playlist.css';
import getPlaylist from './AddSongs.js'

export function Playlist() {
  console.log("Playlist() triggered");
  let playlist = getPlaylist();
  console.log("out of getPlaylist");
  console.log("playlist: " + playlist);
  if(playlist.songs){
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
  } else {
    return(
      <div className="Playlist-container mt-5">
      <div className="list-container">
        <h3>Add songs to preview playlist</h3>
      </div>
    </div>
    );
  }
}

export default Playlist;