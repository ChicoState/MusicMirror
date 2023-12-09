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
  
  componentDidUpdate(prevProps, prevState) {

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
    // Is "id" the user_id in session storage? Because it needs to not be
    // dependent on Spotify being connected.

    // let playlists = getMMPlaylists(id);
    // this.setState({MusicMirrorLists: playlists});
  }

  getSpotifyLists = async() => {

    let playlists = {};
    while (sessionStorage.getItem("verifier") && Object.keys(playlists).length < 2) {
      let test = await getPlaylists();
      if (Object.keys(test).length > 2 && 
          test.href !== "https://api.spotify.com/v1/users/null/playlists?offset=0&limit=20") {

        playlists = test;
      }
    }
    this.setState({SpotifyLists: playlists}, () => {
      console.log("SAVEDPLAYLIST STATE UPDATED: SpotifyLists");
    });
  }

  getYouTubeLists = async() => {

    let playlists = await fetchUserPlaylists();
    this.setState({YouTubeLists: playlists}, () => {
      console.log("SAVEDPLAYLIST STATE UPDATED: YouTubeLists");
      console.log(this.state.YouTubeLists);
    });
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

    if (this.props.service === "spotify" && lists && Object.keys(lists).length > 0 && lists.items) {
      return (
        <div className="SavedPlaylists">
          {/* List of playlists */}
          {lists.items.map((playlist, index) => (
            <div className="my-1 list-card d-flex align-items-center">
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
            <div className="my-1 list-card d-flex align-items-center">
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
          <p>Sign in to view playlists!</p>
        </div>
      );
    }
  }

}

export default SavedPlaylists;