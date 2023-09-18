import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MusicMirror</h1>
      </header>
      <main className="App-main">
        <h2 className="Test-h2">Streaming Service</h2>
        <div className="Test-playlist">
          <h3>Playlist</h3>
          <ol>
              <li>song</li>
              <li>song</li>
              <li>song</li>
              <li>song</li>
              <li>song with a long title</li>
              <li>song</li>
            </ol>
        </div>
      </main>
    </div>
  );
}

export default App;
