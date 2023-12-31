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

// Back end
import * as auth from './auth';
import { emailCheck, createUser, getUsername, deleteUser } from './database';
import { findSongs } from "./playlist";
import * as youtube from './youtube';

// Libraries
import { useState } from "react";
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
  const [youtubeConnection, setYoutubeConnection]=useState(
    sessionStorage.getItem("loggedInYT") === "true"
  );
  const [needsListRefresh, setListRefresh] = useState(false);
  const [viewSignIn, setViewSignIn] = useState(!sessionStorage.getItem("verifier"));
  const [viewSignUp, setViewSignUp] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertHeading, setAlertHeading] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const [progress, setProgress] = useState(false);

  //----------------------------------------------------------------------------
  
  // This function searches for songs and updates the pending playlist
  const handleSearch = async (data, title = "MusicMirror Playlist") => {
    console.log(`Searching! This is search number ${search+1}.`)
    let list = {};
    let listYT = {};

    if (sessionStorage.getItem("token")) {
      list = await findSongs(data, 5);
      list.title = title;
      console.log("new spotify list:", list);
    }
    if (sessionStorage.getItem("youtubeAccessToken")) {
      listYT = await youtube.performYouTubeSearch(data, 5);
      listYT.title = title;
      console.log("new youtube list:", listYT);
    }

    setMMList(Object.keys(list).length > 0? list : listYT);
    setSpotList(list);
    setYTList(listYT);
    setSearch(search+1);
    // setProgress(false);
    handleAlertOpen("Playlist loaded!", "success");
  }

  // Parse a saved playlist from MusicMirror to create a search string
  const handleSearchMM = async (list) => {
    let searchString = "";
    for (let song of list.songs) {
      let term = song.title + " " + song.artist + "\n";
      searchString += term;
    }
    // setProgress(true);
    handleSearch(searchString, list.p_name);
  }

  // Parse a saved playlist from Spotify to create a search string
  const handleSearchSpot = async (list) => {
    // let searchString = "";
    // // spotify lists have links to the list but no song data...
    // setProgress(true);
    // handleSearch(searchString, list.name);
  }

  // Parse a saved playlist from YouTube to create a search string
  const handleSearchYT = async (list) => {
    let searchString = "";
    for (let vid of list.videos) {
      let term = vid.snippet.title + " " + vid.snippet.videoOwnerChannelTitle + "\n";
      searchString += term;
    }
    // setProgress(true);
    handleSearch(searchString, list.snippet.title);
  }

  const handleListAdded = () => {
    setListRefresh(true);
  }

  const handleConfirmRefresh = () => {
    setListRefresh(false);
  }

  // Spotify login
  const handleLogin = async (data) => {
    console.log("handleLogin: Spotify");
    setLog(await auth.signIn(data));
    setSpotifyConnection(data);
  }

  // YouTube login, data is either true or false
  const handleLoginYT = async (data) => {
    console.log("handleLogin: YouTube");
    setYoutubeConnection(data);
  }

  const handleMMLogin = async () => {
    if (password === "") {
      handleAlertOpen("Please enter your password", "info");
    } else if (email === "") {
      handleAlertOpen("Please enter your email address", "info");
    } else if (!(await emailCheck(email))) {
      handleAlertOpen("That email address does not have an account", "info");
    } else if (!(await getUsername(email, password))) {
      handleAlertOpen("Password is incorrect, please try again", "info");
    } else {
      let user = await getUsername(email, password);
      sessionStorage.setItem("usernameMM", user);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("password", password);
      sessionStorage.setItem("loggedInMM", "true");
      setViewSignUp(false);
      setViewSignIn(false);
    }
  }

  const handleMMLogout = async () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setViewSignIn(true);
    auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    console.log("Logging out!");
  }

  const handleNewAccount = async () => {
    if (username === "") {
      handleAlertOpen("Please enter a username", "info");
    } else if (email === "") {
      handleAlertOpen("Please enter a valid email address", "info");
    } else if (await emailCheck(email)) {
      handleAlertOpen("That email address is already in use", "info");
    } else if (password === "") {
      handleAlertOpen("Please enter a password", "info");
    } else if (passwordConfirm === "") {
      handleAlertOpen("Please confirm your password", "info");
    } else if (password !== passwordConfirm) {
      handleAlertOpen("Password and confirmation must be the same", "info");
    } else if (await createUser(username, password, email)) {
      handleMMLogin();
    }
  }

  const handleDeleteAccount = async () => {
    await deleteUser(sessionStorage.getItem("email"));
    handleMMLogout();
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
    handleAlertClose();
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setViewSignIn(true);
    setViewSignUp(false);
  }

  const goToSignUp = () => {
    handleAlertClose();
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
      <div className={progress? "App progress-cursor" : "App"}>
  
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
              <h2 className="mb-3 load">Load Playlists</h2>
              <Tabs id="tab" defaultActiveKey="musicmirrorLeft" justify>
                <Tab tabClassName="tab tab-musicmirror" eventKey="musicmirrorLeft" title="MusicMirror">
                  <div className="tab-body p-3">
                    <SavedPlaylists 
                      service="musicmirror" 
                      connected="true"
                      refresh={needsListRefresh} 
                      confirm={handleConfirmRefresh}
                      load={handleSearchMM}
                      alert={handleAlertOpen}
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
                      load={handleSearchSpot}
                      alert={handleAlertOpen}
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
                      load={handleSearchYT}
                      alert={handleAlertOpen}
                    />
                    <YouTubeConnection handleLogin={handleLoginYT} />
                  </div> 
                </Tab>
                <Tab tabClassName="tab tab-addsongs" eventKey="addsongs" title="New">
                  <div className="tab-body p-3 d-flex flex-column">
                    <AddSongs search={handleSearch} alert={handleAlertOpen} />
                  </div>
                </Tab>
              </Tabs>
            </div> 
            {/* End of the first window */}
            
            {/* Start of the second window */}
            <div className="tab-window p-3 col-12 col-md">
              <h2 className="mb-3 save">Save Playlists</h2>
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
                      <YouTubeConnection handleLogin={handleLoginYT} />
                  </div> 
                </Tab>
              </Tabs>
            </div>
          </div>
          {/* End of page body */}
  
          {/* Page footer */}
          <footer className="App-footer px-3 d-flex justify-content-between align-items-center">
            <p className="m-0">Welcome&nbsp;{
              sessionStorage.getItem("usernameMM")? 
              sessionStorage.getItem("usernameMM") : null
            }</p>
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
                        {sessionStorage.getItem("usernameMM")? 
                          sessionStorage.getItem("usernameMM") 
                          : 
                          "unable to retrieve username"
                        }
                    </p>
                  </div>
                  <div className="d-flex">
                    <p>
                      Email:&nbsp;
                    </p>
                    <p className="user-data">
                        {sessionStorage.getItem("email")? 
                          sessionStorage.getItem("email") 
                          : 
                          "unable to retrieve email"
                        }
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
