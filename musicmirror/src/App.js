import "./styles/App.css";
import AddSongs from "./components/AddSongs";
import SpotifyProfile from "./components/SpotifyProfile";
import YouTube from "./components/YouTube";
import Playlist from "./components/Playlist";
import { useState } from "react";
import { findSongs } from "./playlist";
import {Tabs, Tab} from "react-bootstrap";

function App() {
  const [list, setList] = useState();
  const [search, setSearch] = useState(0);
  
  const handleMsg = async (data) => {
    //change search result count (5) to a user input value later
    setList(await findSongs(data, 5));
    console.log(`Searching! This is search number ${search+1}.`)
    setSearch(search+1);
  }

  return (
    <div className="App">

      {/* Page header */}
      <header className="App-header d-flex justify-content-center align-items-center">
        <h1>MusicMirror</h1>        
      </header>
      {/* End of page header */}

      {/* Page body */}
      <div className="main-wrapper">
        {/* Wrapper to help with columns */}
        <div className="App-main mx-1 p-5 row grid gap-5">
          
          {/* Start of the first window */}
          <div className="tab-window p-3 col-12 col-md">
            <h2 className="mb-3">Your Playlists:</h2>
            <Tabs defaultAct="addSongs" id="tab" justify>
              <Tab tabClassName="tab tab-addsongs" eventKey={"add Songs"} title="New">
                <div className="tab-body p-3 d-flex flex-column">
                  <AddSongs handleMsg={handleMsg}/>
                </div>
              </Tab>
              <Tab tabClassName="tab tab-spotify" eventKey={"spotify"} title="Spotify">
                <div className="tab-body p-3">
                  <SpotifyProfile />
                </div> 
              </Tab>
              <Tab tabClassName="tab tab-youtube" eventKey={"youtube"} title="YT Music">
                <div className="tab-body p-3">
                  <YouTube />
                </div> 
              </Tab>
            </Tabs>
          </div> 
          {/* End of the first window */}
          
          {/* Start of the second window */}
          <div className="tab-window p-3 col-12 col-md">
            <h2 className="mb-3">Preview:</h2>
            <Tabs defaultAct="addSongs" id="tab" justify>
              <Tab tabClassName="tab tab-spotify" eventKey={"spotify"} title="Spotify">
                <div className="tab-body p-3">
                  <SpotifyProfile />
                  <Playlist list={list} search={search}/>
                </div> 
              </Tab>
              <Tab tabClassName="tab tab-youtube" eventKey={"youtube"} title="YT Music">
                <div className="tab-body p-3">
                  <YouTube />
                  <Playlist list={list} search={search}/>
                </div> 
              </Tab>
            </Tabs>
          </div>
          {/*End of the second window */}

        </div>
        {/* End of column wrapper */}
      </div>
      {/* End of page body */}

      {/* Page footer */}
      <footer className="App-footer"></footer>
      {/* End of page footer */}

    </div>
  );
}

export default App;
