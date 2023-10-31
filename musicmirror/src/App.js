import './styles/App.css';
import AddSongs from './components/AddSongs';
import Playlist from './components/Playlist';
import SpotifyProfile from './components/SpotifyProfile';
import { useState } from 'react';
import { findSongs } from './playlist';

function App() {
  const [list, setList] = useState();
  
  const handleMsg = async (data) => {
    //change search result count (5) to a user input value later
    setList(await findSongs(data, 5));
  }

  return (
    <div className="App">
      <header className="App-header d-flex justify-content-center align-items-center">
        <h1>MusicMirror</h1>        
      </header>
      <main className="App-main mx-0 px-5 py-4 container">
        <div className="row grid gap-5">

          {/* Left column */}
          <AddSongs handleMsg={handleMsg}/>

          {/* Right column */}
          <div className="spotify-stuff p-4 col-12 col-md">
            <SpotifyProfile />
            <Playlist list={list}/>
          </div>

        </div>
      </main>
      <footer className="App-footer"></footer>
    </div>
  );
}

export default App;
