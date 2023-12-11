import { getMMPlaylists } from "../database";
import { getPlaylists } from "../playlist";
import { fetchUserPlaylists } from "../youtube";
import React from "react";

class SavedPlaylists extends React.Component{
  constructor(){
    super();
    this.state = {
      MusicMirrorLists: {},
      SpotifyLists: {},
      YouTubeLists: {},
    };
  }

  /*--- COMPONENT LIFECYCLE FUNCTIONS ----------------------------------------*/

  componentDidMount() {
    if (this.props.service === "musicmirror" && 
        this.props.connected) {

      this.getMusicMirrorLists();

    } else if (this.props.service === "spotify" && 
        this.props.connected) {

      this.getSpotifyLists();

    } else if (this.props.service === "youtube" && 
        this.props.connected) {

      this.getYouTubeLists();
    }
  }
  
  componentDidUpdate(prevProps) {

    // Retrieve playlists on service login
    if (this.props.service === "musicmirror" && 
        Object.keys(this.state.MusicMirrorLists).length < 1) {
          
      this.getMusicMirrorLists();

    } else if (this.props.service === "spotify" && 
        sessionStorage.getItem("loggedIn") === "true" && 
        Object.keys(this.state.SpotifyLists).length < 1) {

      this.getSpotifyLists();

    } else if (this.props.service === "youtube" && 
        sessionStorage.getItem("loggedInYT") === "true" && 
        Object.keys(this.state.YouTubeLists).length < 1) {

      this.getYouTubeLists();
      console.log("GETTING YOUTUBE LISTS");
    }

    // Remove playlists on logout
    if (this.props.service === "spotify" && 
        sessionStorage.getItem("loggedIn") !== "true" && 
        this.state.SpotifyLists &&
        Object.keys(this.state.SpotifyLists).length > 0) {

      this.setState({SpotifyLists: {}});

    } else if (this.props.service === "youtube" && 
        sessionStorage.getItem("loggedInYT") !== "true" && 
        this.state.YouTubeLists &&
        Object.keys(this.state.YouTubeLists).length > 0) {

      this.setState({YouTubeLists: {}});
    }

    // Refresh playlists when a new list is added to a service
    if (!prevProps.refresh && this.props.refresh) {
      this.props.confirm();
      if (this.props.service === "musicmirror") {
        this.getMusicMirrorLists();
      } else if (this.props.service === "spotify") {
        this.getSpotifyLists();
      } else if (this.props.service === "youtube") {
        this.getYouTubeLists();
      }
    }
  }

  /*--- HANDLERS -------------------------------------------------------------*/

  getMusicMirrorLists = async() => {
    let playlists = await getMMPlaylists(sessionStorage.getItem("email"));
    if (playlists) {
      this.setState({MusicMirrorLists: playlists}, () => {
        console.log("SAVEDPLAYLIST STATE UPDATED: MusicMirrorLists");
        console.log(this.state.MusicMirrorLists);
      });
    }
  }

  getSpotifyLists = async() => {

    let maxTries = 10;
    let i = 0;
    let playlists = {error: "this is a placeholder"};
    while (sessionStorage.getItem("verifier") && Object.keys(playlists)[0] &&
        Object.keys(playlists)[0] === "error" && i < maxTries) {

      i += 1;
      let test = await getPlaylists();
      if (Object.keys(test).length > 2 && 
          test.href !== "https://api.spotify.com/v1/users/null/playlists?offset=0&limit=20") {

        playlists = test;
      }
    }
    this.setState({SpotifyLists: playlists}, () => {
      console.log("SAVEDPLAYLIST STATE UPDATED: SpotifyLists");
      console.log(this.state.SpotifyLists);
    });
  }

  getYouTubeLists = async() => {
    let playlists = await fetchUserPlaylists();
    if (playlists) {
      this.setState({YouTubeLists: playlists}, () => {
        console.log("SAVEDPLAYLIST STATE UPDATED: YouTubeLists");
        console.log(this.state.YouTubeLists);
      });
    }
  }

  handleSelectList = (list) => {
    // right now the only way to "load" a list is to do a search for the songs
    // that should be in it, and that requires you to be logged in to either
    // youtube or spotify
    if (sessionStorage.getItem("loggedIn") === "true" ||
        sessionStorage.getItem("loggedInYT") === "true") {
          
      this.props.alert("Loading...", "info");
      this.props.load(list);
      console.log("Loading playlist:", list);
    }
  }

  /*--------------------------------------------------------------------------*/

  render() {

    let lists = {};
    if (this.props.service === "musicmirror") {
      lists = this.state.MusicMirrorLists;
    } else if (this.props.service === "spotify") {
      lists = this.state.SpotifyLists;
    } else if (this.props.service === "youtube") {
      lists = this.state.YouTubeLists;
    }

    if ((this.props.service === "musicmirror") && lists && Object.keys(lists).length > 0) {
      return (
        <div className="SavedPlaylists">
          {/* List of playlists */}
          {lists.map((playlist, index) => (
            <div 
              className="my-1 list-card d-flex align-items-center"
              onClick={() => this.handleSelectList(playlist)}
            >
              <h1 className="m-0 px-2 py-1 list-index">{index+1}</h1>
              <div className="p-1 list-data flex-grow-1">
                <h2 className="m-0">{playlist.p_name}</h2>
              </div>
            </div>
          ))}
        </div>
      );

    } else if ((this.props.service === "spotify") && 
        lists && Object.keys(lists).length > 0 && lists.items) {
      return (
        <div className="SavedPlaylists">
          {/* List of playlists */}
          {lists.items.map((playlist, index) => (
            <div 
              className="my-1 list-card d-flex align-items-center"
              onClick={() => this.handleSelectList(playlist)}
            >
              <h1 className="m-0 px-2 py-1 list-index">{index+1}</h1>
              <div className="p-1 list-data flex-grow-1">
                <h2 className="m-0">{playlist.name}</h2>
                {playlist.description?
                  <p className="m-0">{playlist.description}</p> : null
                }
              </div>
            </div>
          ))}
        </div>
      );

    } else if (this.props.service === "youtube" && lists && Object.keys(lists).length > 0) {
      return (
        <div className="SavedPlaylists">
          {/* List of playlists */}
          {lists.map((playlist, index) => (
            <div 
              className="my-1 list-card d-flex align-items-center"
              onClick={() => this.handleSelectList(playlist)}
            >
              <h1 className="m-0 px-2 py-1 list-index">{index+1}</h1>
              <div className="p-1 list-data flex-grow-1">
                <h2 className="m-0">{playlist.snippet.localized.title}</h2>
                {playlist.snippet.localized.description?
                  <p className="m-0">{playlist.snippet.localized.description}</p> : null
                }
              </div>
            </div>
          ))}
        </div>
      );

    } else {
      return (
        <div className="SavedPlaylists">
          <h1>Nothing to see here</h1>
          <p>Sign in and make some playlists!</p>
        </div>
      );
    }
  }

}

export default SavedPlaylists;