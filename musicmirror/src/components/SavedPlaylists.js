import { getPlaylists, searchPlaylists } from "../playlist";
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

      console.log("UPDATING PLAYLISTS ON MOUNT");
      console.log("token: ", localStorage.getItem("token"));
      this.getSpotifyLists();

    } else if (this.props.service === "youtube" && 
        this.props.connected) {

      this.getYouTubeLists();
    }
  }
  
  componentDidUpdate(prevProps, prevState) {

    // Retrieve playlists on service login
    if (this.props.service === "musicmirror" && 
        this.props.connected && 
        !prevProps.connected) {
          
      this.getMusicMirrorLists();

    } else if (this.props.service === "spotify" && 
        this.props.connected && 
        !prevProps.connected) {

      console.log("UPDATING PLAYLISTS ON LOGIN");
      console.log("token: ", localStorage.getItem("token"));
      this.getSpotifyLists();

    } else if (this.props.service === "youtube" && 
        this.props.connected && 
        !prevProps.connected) {

      this.getYouTubeLists();
    }

    // Remove playlists on logout
    if (this.props.service === "musicmirror" && 
        !this.props.connected && 
        prevProps.connected) {
          
      this.setState({MusicMirrorLists: {}});

    } else if (this.props.service === "spotify" && 
        !this.props.connected && 
        prevProps.connected) {

      console.log("UPDATING PLAYLISTS ON LOGOUT");
      console.log("token: ", localStorage.getItem("token"));
      this.setState({SpotifyLists: {}});

    } else if (this.props.service === "youtube" && 
        !this.props.connected && 
        prevProps.connected) {

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
    // let playlists = await getPlaylists();
    // if (playlists && Object.keys(playlists).length > 0) {
    //   this.setState({MusicMirrorLists: playlists}, () => {
    //     console.log("SAVEDPLAYLIST STATE UPDATED: MusicMirrorLists");
    //   });
    // }
  }

  getSpotifyLists = async() => {
    let playlists = await getPlaylists();
    if (playlists && Object.keys(playlists).length > 0) {
      this.setState({SpotifyLists: playlists}, () => {
        console.log("SAVEDPLAYLIST STATE UPDATED: SpotifyLists");
      });
    }
  }

  getYouTubeLists = async() => {
    // let playlists = await getPlaylists();
    // if (playlists && Object.keys(playlists).length > 0) {
    //   this.setState({YouTubeLists: playlists}, () => {
    //     console.log("SAVEDPLAYLIST STATE UPDATED: YouTubeLists");
    //   });
    // }
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

    if (lists && Object.keys(lists).length > 0 && lists.items) {
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

    } else {
      console.log("WHY AREN'T LISTS SHOWING UP??????");
      console.log("this.props.service: ", this.props.service);
      console.log("this.props.connected: ", this.props.connected);
      console.log("this.state.SpotifyLists: ", this.state.SpotifyLists);
      console.log("localStorage.getItem('token'): ", localStorage.getItem("token"));
      return (
        <div className="SavedPlaylists">
          <p>No playlists yet!</p>
        </div>
      );
    }
  }

}

export default SavedPlaylists;