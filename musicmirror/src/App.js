import './App.css';
import Playlist from './components/Playlist';
import * as auth from './auth';

function App() {
  auth.checkCode();
  return (
    <div className="App">
      <header className="App-header">
        <h1>MusicMirror</h1>
      </header>
      <main className="App-main">
        <Playlist />
      </main>
    </div>
  );
}

export default App;
