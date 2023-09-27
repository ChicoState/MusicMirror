import './styles/App.css';
import Playlist from './components/Playlist';
import AddSongs from './components/AddSongs';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MusicMirror</h1>
      </header>
      <main className="App-main">
        <Playlist />
        <AddSongs />
      </main>
    </div>
  );
}

export default App;
