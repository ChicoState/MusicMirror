import playlist from '../playlist.json';
import '../styles/Playlist.css';

function Playlist() {
  return (
    <div className="Playlist-container">
      <h2 className="service-name">Streaming Service</h2>
      <div className="list-container">
        <h3>{playlist.title}</h3>
        <ol>
            {playlist.songs.map((song) => (
              <li>{song.title} | {song.artist} | {song.album} | {song.length}</li>
            ))}
          </ol>
      </div>
    </div>
  );
}

export default Playlist;