import './styles/App.css';
import AddSongs from './components/AddSongs';
import Playlist from './components/Playlist';
import SpotifyProfile from './components/SpotifyProfile';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Apple from './pages/apple';
import Youtube from './pages/youtube';
import { useState } from 'react';

function App() {
  const [isShowing, setShowing] = useState(false);
  
  const passData = (data) => {
    setShowing(data);
  }

  return (
    
    <div className="App">
      
      <Navbar/>
      <header className="App-header d-flex justify-content-center align-items-center">
        <h1>MusicMirror</h1>
      </header>
      <main className="App-main mx-0 px-5 py-4 container">
        
        <div className="row grid gap-5">
          <AddSongs passData={passData} />
          <div className="spotify-stuff p-4 col-12 col-md">
            <SpotifyProfile />
            <Playlist/>
            {isShowing && <Playlist />}
          </div>
        </div>
      </main>
      
      <footer className="App-footer"></footer>
      
    </div>
  );
}

export default App;
