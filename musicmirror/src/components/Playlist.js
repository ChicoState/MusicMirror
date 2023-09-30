import testlist from '../testlist.json';
import '../styles/Playlist.css';

function Playlist() {
  return (
    <div className="Playlist-container mt-5">
      <div className="list-container">
        <h3>{testlist.title}</h3>
        <ol className="">
            {testlist.songs.map((song) => (
              <li className="">{song.title} | {song.artist} | {song.album} | {song.length}</li>
            ))}
          </ol>
      </div>
      <button className="btn btn-secondary">Create Playlist</button>
    </div>
  );
}

export default Playlist;