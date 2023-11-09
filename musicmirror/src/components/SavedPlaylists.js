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
    if (this.props.service === "musicmirror" && this.props.connected && Object.keys(this.state.MusicMirrorLists).length === 0) {
      this.getMusicMirrorLists();
    } else if (this.props.service === "spotify" && this.props.connected && Object.keys(this.state.SpotifyLists).length === 0) {
      this.getSpotifyLists();
    } else if (this.props.service === "youtube" && this.props.connected && Object.keys(this.state.YouTubeLists).length === 0) {
      this.getYouTubeLists();
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.props.service === "musicmirror" && this.props.connected && Object.keys(this.state.MusicMirrorLists).length === 0) {
      this.getMusicMirrorLists();
    } else if (this.props.service === "spotify" && this.props.connected && Object.keys(this.state.SpotifyLists).length === 0) {
      this.getSpotifyLists();
    } else if (this.props.service === "youtube" && this.props.connected && Object.keys(this.state.YouTubeLists).length === 0) {
      this.getYouTubeLists();
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
              <h1 className="m-0 px-2 py-1 list-index">{index}</h1>
              <div className="p-1 list-data flex-grow-1">
                <h2 className="m-0">{playlist.name}</h2>
                <p className="m-0">{playlist.description? playlist.description : "No description provided"}</p>
              </div>
            </div>
          ))}
        </div>
      );

    } else {
      return (
        <div className="SavedPlaylists">
          <p>No playlists yet!</p>
        </div>
      );
    }
  }

}

export default SavedPlaylists;