import './styles/App.css';
import AddSongs from './components/AddSongs';
import Playlist from './components/Playlist';
import SpotifyProfile from './components/SpotifyProfile';
import { useState } from 'react';
import { findSongs } from './playlist';
import {Tabs, Tab} from 'react-bootstrap';
function App() {
  const [list, setList] = useState();
  
  const handleMsg = async (data) => {
    setList(await findSongs(data));
  }

  return (
  <div className="App">
    <header className="App-header d-flex justify-content-center align-items-center">
      <h1>MusicMirror</h1>        
    </header>
      {/*  <//"App-main mx-0 px-5 py-4 container"> */}
    <div className= "App-main mx-0 px-5 py-4 container">
      <div className='row grid gap-5'>

        <Tabs defaultAct="addSongs" id="tab">
            <Tab eventKey={"add Songs"} title="Add Songs">
              <AddSongs handleMsg={handleMsg}/>
            </Tab>
            <Tab eventKey={"spotify"} title ="Spotify">
              <div className="spotify-stuff p-4 col-12 col-md">
                <SpotifyProfile />
                <Playlist list={list}/>
              </div> 
            </Tab>
            <Tab eventKey="youtube" title="Youtube">
                <div className='Youtube'>
                  <h1>
                    Signing into Youtube
                  </h1>
                    <button > Signing</button>
                </div>
            </Tab>
        </Tabs>
      {/**-------------------------------------------- */}
        <Tabs className='p-4 col-12 col-md' defaultAct="addSongs" id="tab">
            <Tab eventKey={"add Songs"} title="Add Songs">
              <AddSongs handleMsg={handleMsg}/>
            </Tab>
            <Tab eventKey={"spotify"} title ="Spotify">
              <div className="spotify-stuff p-4 col-12 col-md">
                <SpotifyProfile />
                <Playlist list={list}/>
              </div> 
            </Tab>
            <Tab eventKey="youtube" title="Youtube">
                <div className='Youtube'>
                  <h1>
                    Signing into Youtube
                  </h1>
                    <button > Signing</button>
                </div>
            </Tab>
        </Tabs>










      </div> 
    </div>

    <footer className="App-footer"></footer>

    <div className='App-main mx-0 my-5 px-5 py-4 container'>
      <div className='col-auto'>
            <Tabs defaultAct="addSongs" id="tab">
                <Tab eventKey={"add Songs"} title="Add Songs">
                  <AddSongs handleMsg={handleMsg}/>
                </Tab>
                <Tab eventKey={"spotify"} title ="Spotify">
                  <div className="spotify-stuff p-4 col-12 col-md">
                    <SpotifyProfile />
                    <Playlist list={list}/>
                  </div> 
                </Tab>
                <Tab eventKey="youtube" title="Youtube">
                    <div className='Youtube'>
                      <h1>
                        Signing into Youtube
                      </h1>
                        <button > Signing</button>
                    </div>
                </Tab>
              </Tabs>
        </div>
    </div>

  </div>
    
  );
}

export default App;
