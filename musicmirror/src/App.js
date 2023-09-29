import './styles/App.css';
import Playlist from './components/Playlist';
import AddSongs from './components/AddSongs';

function App() {
  return (
    <div className="App">
      <header className="App-header d-flex justify-content-center align-items-center">
        <h1>MusicMirror</h1>
      </header>
      <main className="App-main mx-0 px-5 py-4 container">
        <div className="row grid gap-5">
          <Playlist />
          <AddSongs />
        </div>
      </main>
      <footer className="App-footer"></footer>
    </div>
  );
}

export default App;
