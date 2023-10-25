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
      {/*main wrapper, can be changed to a container as well, for now its a wrapper */}
    <div className='main-wrapper'>

      {/*Start of  window */}
        <div className= "App-main mx-1 px-5 py-4 row">
          
          {/*Start of the first tabs of the window*/}
            <div className='row grid gap-5 col-md '>
              <Tabs defaultAct="addSongs " id="tab">
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
          {/*End of first tabs */}
          
          {/*Start of second window */}
                  <div className='row grid gap-5 col-md'>
                    <Tabs defaultAct="addSongs " id="tab">
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
          {/*End of second window  */}
        </div>
        {/*End of  window  */}

    </div>
    <footer className="App-footer"></footer>

  </div>
    
  );
}

export default App;
