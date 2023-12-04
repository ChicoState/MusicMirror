import "./styles/App.css";
import AddSongs from "./components/AddSongs";
import SavedPlaylists from "./components/SavedPlaylists";
import SpotifyProfile from "./components/SpotifyProfile";
import YouTube from "./components/YouTube";
import PlaylistMM from "./components/PlaylistMM";
import PlaylistSpot from "./components/PlaylistSpot";
import PlaylistYT from "./components/PlaylistYT";
import { useEffect, useState } from "react";
import { findSongs } from "./playlist";
import {Tabs, Tab} from "react-bootstrap";
import * as auth from './auth';

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [MMList, setMMList] = useState();
  const [SpotList, setSpotList] = useState();
  const [YTList, setYTList] = useState();
  const [search, setSearch] = useState(0);
  const [loggedIn, setLog] = useState();
  const [spotifyConnection, setSpotifyConnection] = useState(
    localStorage.getItem("token") && localStorage.getItem("token") !== null &&
    localStorage.getItem("user_id") && localStorage.getItem("user_id") !== null
  );
  const [needsListRefresh, setListRefresh] = useState(false);
  const [viewSignIn, setViewSignIn] = useState(true);
  const [viewSignUp, setViewSignUp] = useState(false);

  //----------------------------------------------------------------------------

  useEffect(() => {
    const handleStorageUpdate = (event) => {
      if (event.key === "loggedIn") {
        setSpotifyConnection(localStorage.getItem("loggedIn") === "true");
      }
    };

    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
    }
  }, []);

  //----------------------------------------------------------------------------
  
  const handleMsg = async (data) => {
    console.log(`Searching! This is search number ${search+1}.`)
    //change search result count (5) to a user input value later
    let list = await findSongs(data, 5)
    setMMList(list);
    setSpotList(list);
    // setYTList(list);
    setSearch(search+1);
  }

  const handleLogin = async (data) => {
    console.log("handleLogin");
    setLog(await auth.signIn(data));
    setSpotifyConnection(true);
  }

  const handleMMLogin = async (data) => {
    setViewSignUp(false);
    setViewSignIn(false);
  }

  const handleMMLogout = async () => {
    setViewSignIn(true);
  }

  const handleNewAccount = async (data) => {
    handleMMLogin(data);
  }

  const handleListAdded = () => {
    setListRefresh(true);
  }

  const handleConfirmRefresh = () => {
    setListRefresh(false);
  }

  const handleEmail = event => {
    console.log("Handling email!");
    setEmail(event.target.value);
  };

  const handlePassword = event => {
    console.log("Handling password!");
    setPassword(event.target.value);
  };

  const handlePasswordConfirm = event => {
    console.log("Handling password confirmation!");
    setPasswordConfirm(event.target.value);
  };

  //----------------------------------------------------------------------------

  const goToSignIn = () => {
    setViewSignIn(true);
    setViewSignUp(false);
  }

  const goToSignUp = () => {
    setViewSignUp(true);
    setViewSignIn(false);
  }

  //----------------------------------------------------------------------------

  // Default view when not logged in
  if (viewSignIn) {
    return (
      <div className="App sign-in">

        {/* Page body */}
        <div className="main-wrapper">
          <div className="App-main mx-0 p-5 d-flex flex-column justify-content-between align-items-center">
            <h1 className="login-heading">MusicMirror Sign In</h1>
            <div className="login">
              <div className="my-3">
                <label for="login-email" className="form-label">
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="login-email" 
                  onChange={handleEmail} 
                  value={email}
                />
              </div>
              <div className="mb-3">
                <label for="login-password" className="form-label">
                  Password
                </label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="login-password" 
                  onChange={handlePassword} 
                  value={password}
                />
              </div>
              <button className="mt-3 btn btn-secondary" onClick={handleMMLogin}>
                Sign In!
              </button>
            </div>
            {/* Double-check this href and update the href for the signup section */}
            <p className="m-0">
              Don't have an account yet?&nbsp;
              <button className="redirect" onClick={goToSignUp}>
                Sign up!
              </button>
            </p>
          </div>
        </div>
        {/* End of page body */}

      </div>
    );

  //----------------------------------------------------------------------------

  // View for creating a new account
  } else if (viewSignUp) {
    return (
      <div className="App sign-up">

        {/* Page body */}
        <div className="main-wrapper">
          <div className="App-main mx-0 p-5 d-flex flex-column justify-content-between align-items-center">
            <h1 className="login-heading">MusicMirror New Account</h1>
            <div className="login">
              <div className="my-3">
                <label for="signup-email" className="form-label">
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="signup-email" 
                  onChange={handleEmail} 
                  value={email}
                />
              </div>
              <div className="mb-3">
                <label for="signup-password" className="form-label">
                  Password
                </label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="signup-password" 
                  onChange={handlePassword} 
                  value={password}
                />
              </div>
              <div className="mb-3">
                <label for="password-confirmation" className="form-label">
                  Confirm Password
                </label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="password-confirmation" 
                  onChange={handlePasswordConfirm} 
                  value={passwordConfirm}
                />
              </div>
              <button className="mt-3 btn btn-secondary" onClick={handleNewAccount}>
                Create Account!
              </button>
            </div>
            <p className="m-0">
              Already have an account?&nbsp;
              <button className="redirect" onClick={goToSignIn}>
                Sign in!
              </button>
            </p>
          </div>
        </div>
        {/* End of page body */}

      </div>
    );

  //----------------------------------------------------------------------------

  // View when logged in
  } else {
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
          <div className="App-main mx-0 px-5 row grid gap-5">
            
            {/* Start of the first window */}
            <div className="tab-window p-3 col-12 col-md">
              <h2 className="mb-3">Your Playlists:</h2>
              <Tabs id="tab" defaultActiveKey="musicmirrorLeft" justify>
                <Tab tabClassName="tab tab-musicmirror" eventKey="musicmirrorLeft" title="MusicMirror">
                  <div className="tab-body p-3">
                    <SavedPlaylists 
                      service="musicmirror" 
                      connected="false" 
                      refresh={needsListRefresh} 
                      confirm={handleConfirmRefresh}
                    />
                  </div> 
                </Tab>
                <Tab tabClassName="tab tab-spotify" eventKey="spotifyLeft" title="Spotify">
                  <div className="tab-body p-3">
                    <SpotifyProfile handleLogin={handleLogin}/>
                    <SavedPlaylists 
                      service="spotify" 
                      connected={spotifyConnection} 
                      refresh={needsListRefresh} 
                      confirm={handleConfirmRefresh}
                    />
                  </div> 
                </Tab>
                <Tab tabClassName="tab tab-youtube" eventKey="youtubeLeft" title="YT Music">
                  <div className="tab-body p-3">
                    <YouTube />
                    <SavedPlaylists 
                      service="youtube" 
                      connected="false" 
                      refresh={needsListRefresh} 
                      confirm={handleConfirmRefresh}
                    />
                  </div> 
                </Tab>
                <Tab tabClassName="tab tab-addsongs" eventKey="addsongs" title="New">
                  <div className="tab-body p-3 d-flex flex-column">
                    <AddSongs handleMsg={handleMsg}/>
                  </div>
                </Tab>
              </Tabs>
            </div> 
            {/* End of the first window */}
            
            {/* Start of the second window */}
            <div className="tab-window p-3 col-12 col-md">
              <h2 className="mb-3">Preview:</h2>
              <Tabs id="tab" defaultActiveKey="musicmirrorRight" justify>
                <Tab tabClassName="tab tab-musicmirror" eventKey="musicmirrorRight" title="MusicMirror">
                  <div className="tab-body p-3">
                    <PlaylistMM service="musicmirror" list={MMList} search={search} save={handleListAdded}/>
                  </div> 
                </Tab>
                <Tab tabClassName="tab tab-spotify" eventKey="spotifyRight" title="Spotify">
                  <div className="tab-body p-3">
                    <SpotifyProfile handleLogin={handleLogin}/>
                    <PlaylistSpot service="spotify" list={SpotList} search={search} save={handleListAdded}/>
                  </div> 
                </Tab>
                <Tab tabClassName="tab tab-youtube" eventKey="youtubeRight" title="YT Music">
                  <div className="tab-body p-3">
                    <YouTube />
                    <PlaylistYT service="youtube" list={YTList} search={search} save={handleListAdded}/>
                  </div> 
                </Tab>
              </Tabs>
            </div>
          </div>
          {/* End of page body */}
  
          {/* Page footer */}
          <footer className="App-footer px-3 d-flex justify-content-between align-items-center">
            <p className="m-0">Current User: username here</p>
            <p className="m-0 mm-logout" onClick={handleMMLogout}>Log Out of MusicMirror</p>
          </footer>
          {/* End of page footer */}
        </div>
      </div>
    );
  }
}

export default App;
