import playlist from '../playlist.json';

function Playlist() {
  return (
    <div className="Playlist-container">
      <h2 className="Test-h2">Streaming Service</h2>
      <div className="Test-playlist">
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