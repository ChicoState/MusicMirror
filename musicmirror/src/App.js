// Styles
import "./styles/App.css";

// Components
import AddSongs from "./components/AddSongs";
import PageAlert from "./components/PageAlert";
import PlaylistMM from "./components/PlaylistMM";
import PlaylistSpot from "./components/PlaylistSpot";
import PlaylistYT from "./components/PlaylistYT";
import SavedPlaylists from "./components/SavedPlaylists";
import SpotifyConnection from "./components/SpotifyConnection";
import YouTubeConnection from "./components/YouTubeConnection";
// import YouTube from "./components/YouTube";

// Back end
import * as auth from './auth';
import { emailCheck, createUser, getUsername, deleteUser, getMMPlaylists } from './database';
import { findSongs } from "./playlist";
import * as youtube from './youtube';

// Libraries
import { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";

//==============================================================================

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [MMList, setMMList] = useState();
  const [SpotList, setSpotList] = useState();
  const [YTList, setYTList] = useState();
  const [search, setSearch] = useState(0);
  const [loggedIn, setLog] = useState(false);
  //const [setLog] = useState();
  const [spotifyConnection, setSpotifyConnection] = useState(
    sessionStorage.getItem("loggedIn") === "true"
  );
  const [youtubeConnection, setYoutubeConnection]=useState(false);
  const [needsListRefresh, setListRefresh] = useState(false);
  const [viewSignIn, setViewSignIn] = useState(!sessionStorage.getItem("verifier"));
  const [viewSignUp, setViewSignUp] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertHeading, setAlertHeading] = useState("");
  const [alertVariant, setAlertVariant] = useState("");

  //----------------------------------------------------------------------------

  useEffect(() => {
    const handleStorageUpdate = (event) => {
      if (event.key === "loggedIn") {
        setSpotifyConnection(sessionStorage.getItem("loggedIn") === "true");
        console.log("Spotify is connected!");
      } else if (event.key === "loggedInYT") {
        setYoutubeConnection(sessionStorage.getItem("loggedInYT") === "true");
        console.log("YouTube is connected!");
      }
    };

    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
    }
  }, []);

  //----------------------------------------------------------------------------
  
  // This function searches for songs and updates the pending playlist
  const handleMsg = async (data) => {
    console.log(`Searching! This is search number ${search+1}.`)

    let list;
    if (sessionStorage.getItem("loggedIn") === "true") {
      list = await findSongs(data, 5);
    } else {
      // list = await youtube.findSongs(data);
      list = await youtube.performYouTubeSearch(data, 5);
    }

    setMMList(list);
    setSpotList(list);
    setYTList(list);
    setSearch(search+1);
    handleAlertOpen("Search complete!", "success");
  }

  // Spotify login
  const handleLogin = async (data) => {
    console.log("handleLogin");
    setLog(await auth.signIn(data));
    setSpotifyConnection(true);
  }

  const handleMMLogin = async () => {
    
    if (password === "") {
      handleAlertOpen("Please enter your password", "info");
    } else if (email === "") {
      handleAlertOpen("Please enter your email address", "info");
    // } else if (email not in database) {
    //   handleAlertOpen("That email address does not have an account", "info");
    // } else if (password is incorrect) {
    //   handleAlertOpen("Password is incorrect, please try again", "info");
    } else {
      setViewSignUp(false);
      setViewSignIn(false);
      sessionStorage.setItem("loggedInMM", "true");
    }
  }

  const handleMMLogout = async () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setViewSignIn(true);
    sessionStorage.setItem("loggedInMM", "false");
    // Do we need a func to refresh the session?
  }

  const handleNewAccount = async () => {
    if (username === "") {
      handleAlertOpen("Please enter a username", "info");
    } else if (email === "") {
      handleAlertOpen("Please enter a valid email address", "info");
    // } else if (some func that says email is in use) {
    //   handleAlertOpen("That email address is already in use", "info");
    } else if (password === "") {
      handleAlertOpen("Please enter a password", "info");
    } else if (passwordConfirm === "") {
      handleAlertOpen("Please confirm your password", "info");
    } else if (password !== passwordConfirm) {
      handleAlertOpen("Password and confirmation must be the same", "info");
    } else {
      // func to add user to database
      handleMMLogin();
    }
  }

  const handleDeleteAccount = async () => {
    handleMMLogout();
    deleteUser(email);
    // needs a func to remove the user from the database
  }

  const handleListAdded = () => {
    setListRefresh(true);
  }

  const handleConfirmRefresh = () => {
    setListRefresh(false);
  }

  const handleUsername = event => {
    console.log("Handling username!");
    setUsername(event.target.value);
  };

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

  const handleAlertOpen = (heading, variant) => {
    setAlertHeading(heading);
    setAlertVariant(variant);
    setAlertShow(true);
  }

  const handleAlertClose = () => {
    setAlertShow(false);
    setAlertHeading("");
    setAlertVariant("");
  }

  //----------------------------------------------------------------------------
  const goToSignIn = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setViewSignIn(true);
    setViewSignUp(false);
  }

  const goToSignUp = () => {
    setEmail("");
    setPassword("");
    setViewSignUp(true);
    setViewSignIn(false);
  }

  //----------------------------------------------------------------------------

  // Default view when not logged in
  if (viewSignIn && sessionStorage.getItem("loggedInMM") !== "true") {
    return (
      <div className="App sign-in">

        {/* Alert */}
        <PageAlert 
          show={alertShow} 
          heading={alertHeading} 
          variant={alertVariant}
          close={handleAlertClose} 
        />
        {/* End alert */}

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
  } else if (viewSignUp && sessionStorage.getItem("loggedInMM") !== "true") {
    return (
      <div className="App sign-up">

        {/* Alert */}
        <PageAlert 
          show={alertShow} 
          heading={alertHeading} 
          variant={alertVariant}
          close={handleAlertClose} 
        />
        {/* End alert */}

        {/* Page body */}
        <div className="main-wrapper">
          <div className="App-main mx-0 p-5 d-flex flex-column justify-content-between align-items-center">
            <h1 className="login-heading">MusicMirror New Account</h1>
            <div className="login">
              <div className="my-3">
                <label for="signup-username" className="form-label">
                  Username
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="signup-username" 
                  onChange={handleUsername} 
                  value={username}
                />
              </div>
              <div className="mb-3">
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

        {/* Alert displays in fixed position beneath header, when visible */}
        <PageAlert 
          show={alertShow} 
          heading={alertHeading} 
          variant={alertVariant}
          close={handleAlertClose} 
        />
        {/* End alert */}
  
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
                    <SavedPlaylists 
                      service="spotify" 
                      connected={spotifyConnection} 
                      refresh={needsListRefresh} 
                      confirm={handleConfirmRefresh}
                    />
                    <SpotifyConnection handleLogin={handleLogin}/>
                  </div> 
                </Tab>
                <Tab tabClassName="tab tab-youtube" eventKey="youtubeLeft" title="YT Music">
                  <div className="tab-body p-3">
                    <SavedPlaylists 
                      service="youtube" 
                      connected={youtubeConnection} 
                      refresh={needsListRefresh} 
                      confirm={handleConfirmRefresh}
                    />
                    <YouTubeConnection connected={youtubeConnection} />
                  </div> 
                </Tab>
                <Tab tabClassName="tab tab-addsongs" eventKey="addsongs" title="New">
                  <div className="tab-body p-3 d-flex flex-column">
                    <AddSongs handleMsg={handleMsg} alert={handleAlertOpen} />
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
                    <PlaylistMM 
                      service="musicmirror" 
                      list={MMList} 
                      search={search} 
                      save={handleListAdded}
                      alert={handleAlertOpen}
                    />
                  </div> 
                </Tab>
                <Tab tabClassName="tab tab-spotify" eventKey="spotifyRight" title="Spotify">
                  <div className="tab-body p-3">
                    <PlaylistSpot 
                      service="spotify" 
                      list={SpotList} 
                      search={search} 
                      save={handleListAdded}
                      alert={handleAlertOpen}
                    />
                    <SpotifyConnection handleLogin={handleLogin}/>
                  </div> 
                </Tab>
                <Tab tabClassName="tab tab-youtube" eventKey="youtubeRight" title="YT Music">
                  <div className="tab-body p-3">
                      {/* <YouTube searchTerm={YTList}/> */}
                      <PlaylistYT 
                        service="youtube" 
                        list={YTList} 
                        search={search} 
                        save={handleListAdded}
                        alert={handleAlertOpen}
                      />
                      <YouTubeConnection connected={youtubeConnection} />
                  </div> 
                </Tab>
              </Tabs>
            </div>
          </div>
          {/* End of page body */}
  
          {/* Page footer */}
          <footer className="App-footer px-3 d-flex justify-content-between align-items-center">
            <p className="m-0">Current User: {username !== ""? username : "no username provided"}</p>
            <div className="d-flex">
              <p className="m-0 mm-logout" onClick={handleMMLogout}>Log Out of MusicMirror</p>
              <p className="my-0 mx-2">|</p>
              <p 
                className="m-0 mm-delete" 
                data-bs-toggle="modal" 
                data-bs-target="#confirm-delete-account"
              >
                Delete my Account
              </p>
            </div>
          </footer>
          {/* End of page footer */}

          {/* Account deletion confirmation modal */}
          <div 
            id="confirm-delete-account" 
            className="modal fade" 
            tabIndex="-1" 
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-fullscreen-sm-down">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title">Are you sure you want to delete this account?</h1>
                  <button 
                    className="ms-2 btn-close btn-close-white" 
                    type="button" 
                    data-bs-dismiss="modal" 
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="d-flex">
                    <p>
                      Username:&nbsp;
                    </p>
                    <p className="user-data">
                        {username !== ""? username : "no username provided"}
                    </p>
                  </div>
                  <div className="d-flex">
                    <p>
                      Email:&nbsp;
                    </p>
                    <p className="user-data">
                        {email !== ""? email : "no email provided"}
                    </p>
                  </div>
                  <br />
                  <p><b>
                    WARNING: If you delete your account, all playlists saved to
                    MusicMirror will be lost.
                  </b></p>
                </div>
                <div className="modal-footer d-flex">
                  <button 
                    className="nevermind-button btn btn-secondary flex-fill"
                    type="button" 
                    data-bs-dismiss="modal" 
                  >
                    Not Now
                  </button>
                  <button 
                    className="delete-button btn btn-secondary flex-fill"
                    type="button" 
                    data-bs-dismiss="modal"
                    onClick={handleDeleteAccount}
                  >
                    Delete It
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End of account deletion modal */}

        </div>
      </div>
    );
  }
}

export default App;
