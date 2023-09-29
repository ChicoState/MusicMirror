import testlist from '../testlist.json';
import * as playlist from '../playlist';
import '../styles/Playlist.css';

function Playlist() {
  return (
    <div className="Playlist-container">
      <div className="list-container">
        <h3>{testlist.title}</h3>
        <ol className="">
            {testlist.songs.map((song) => (
              <li className="">{song.title} | {song.artist} | {song.album} | {song.length}</li>
            ))}
          </ol>
      </div>
      <button onClick={playlist.findSongs}>Find Songs</button>
    </div>
  );
}

export default Playlist;