import React from "react";
import SongDetailsModal from "./SongDetailsModal";
import * as yt from '../youtube';
import PlaylistCreationYT from "../PlaylistCreationYT";
class PlaylistYT extends React.Component{
  constructor(){
    super();
    this.state = {
      playlist: {},
      isEditing: false,
      currentTitle: "New Music Mirror Playlist",
      selectedSong: {},
      selectedIndex: null,
      search: 1,
      selectedPlaylist: null,
      userPlaylists: []
    };
  }

  /*--- COMPONENT LIFECYCLE FUNCTIONS ----------------------------------------*/

  componentDidUpdate() {

    /* Update state.playlist if a new search occurred. */
    if (this.props.list &&
        this.state.playlist &&
        this.props.search >= this.state.search) {

      console.log("New search, updating state!");
      this.setState({playlist: this.props.list, search: this.props.search+1}, () => {
        console.log("PLAYLIST STATE UPDATE COMPLETE: playlist, search")
      });
    }
  }
/*==Mounting====================== */
  componentDidMount (){
    this.fetchUserPlaylists();
  }

  fetchUserPlaylists = async () => {
    const playlists = await yt.fetchUserPlaylists();
    this.setState({ userPlaylists: playlists });
  };

  handlePlaylistSelection = (event) => {
    this.setState({ selectedPlaylist: event.target.value });
  };



  /*--- HANDLERS -------------------------------------------------------------*/

  handleBlur = () => {
    console.log("handleBlur");
    this.setState({ isEditing: false }, () => {
      console.log("PLAYLIST STATE UPDATE COMPLETE: isEditing:false");
    });
    // Call a function passed as a prop to update the list title
    this.onTitleChange(this.state.currentTitle);
  };


  handleChange = (e) => {
    console.log("handleChange");
    this.setState({ currentTitle: e.target.value }, () => {
      console.log("PLAYLIST STATE UPDATE COMPLETE: currentTitle");
    });
  };


  handleDoubleClick = (two) => {
    console.log("handleDoubleClick");
    if (!this.state.isEditing) {
      this.setState({ isEditing: true }, () => {
        console.log("PLAYLIST STATE UPDATE COMPLETE: isEditing:true");
      });
    }
  };


  handleSave = async() => {
    if (sessionStorage.getItem("loggedInYT") !== "true") {
      this.props.alert("You must be signed in to YouTube to save this playlist!", "info");
    } else {
      //await youtube_gen_playlist_func;
      const title = this.state.currentTitle;
      const videos = this.state.playlist;//<- deals with the search getting the searchs from it the list of the data for the playlist
      
      yt.createPlaylist(title, videos);
      this.props.save();
      this.props.alert(`${this.state.currentTitle} playlist saved to YouTube!`, "success");
    }
  }


  /* Note which song card was clicked on */
  handleSongSelection = (song, index) => {
    this.setState({selectedSong: song, selectedIndex: index}, () => {
      console.log("PLAYLIST STATE UPDATE COMPLETE: selectedSong, selectedIndex");
    });
    console.log(`selected song: ${song.tracks[0].title}`);
  };


  onTitleChange = (newTitle) => {
    console.log("onTitleChange");
    const newList = {...this.state.playlist};
    newList.title = this.state.currentTitle;
    this.setState({playlist: newList}, () => {
      console.log("PLAYLIST STATE UPDATE COMPLETE: playlist");
    });
  };


  /* Update or delete a song card */
  handleUpdate = (updatedSong) => {
    const newList = {...this.state.playlist};

    /* If passed nothing, remove the currently selected song */
    if (!updatedSong) {
      this.props.alert(`Song removed: ${this.state.selectedSong.title}`, "success");
      newList.songs = newList.songs.filter((song, index) => 
        index !== this.state.selectedIndex
      );
      this.setState({playlist: newList, selectedIndex: null}, () => {
        console.log("STATE UPDATE COMPLETE, REMOVED SONG");
      });
      console.log("REMOVED LIST ITEM");
      console.log(newList);

    /* If passed a song, replace the currently selected song */
    } else {
      this.props.alert(
        `Song updated: ${this.state.selectedSong.title} is now ${updatedSong.title}`, 
        "success"
      );
      newList.songs[this.state.selectedIndex] = updatedSong;
      this.setState({playlist: newList, selectedSong: updatedSong}, () => {
        console.log("STATE UPDATE COMPLETE, CHANGED SONG");
      });
    }
  };
/**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

  handleAddSongToPlaylist = async (song) => {
    const { selectedPlaylist } = this.state;
    const accessToken = sessionStorage.getItem('youtubeAccessToken');
  
    if (!selectedPlaylist) {
      alert('Please select a playlist first.');
      return;
    }
  
    try {
      await yt.addSongToPlaylist(selectedPlaylist, song.id.videoId, accessToken);
      alert(`Added ${song.title} to playlist`);
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      alert('Failed to add song to playlist');
    }
  }
/**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
  

  /*--------------------------------------------------------------------------*/

  render() {
      
    /* If there are no songs to display, instruct users to add songs */
    if (!this.props.list || 
        !this.state.playlist ||
        Object.keys(this.state.playlist).length === 0 ||
        (Object.keys(this.state.playlist).length > 0 &&
        this.state.playlist.songs.length === 0)) {

      return (
        <div className="Playlist">
          <h1>Choose a playlist to preview, or create a new one.</h1>
        </div>
      );
    
    /* If there are songs to display, render song cards */
    } else if (this.state.playlist && 
        Object.keys(this.state.playlist).length > 0) {
      return (
        <div className="Playlist">
          <h1 className="list-title">
            {this.state.isEditing? 
            (<div className="d-flex justify-content-between align-items-center">
              <input 
                type="text" 
                value={this.state.currentTitle} 
                onChange={this.handleChange} 
                onBlur={this.handleBlur} 
                autoFocus
              />
              <svg className="bi bi-pencil-square" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
              </svg>
              { //Added here for adding songs, drop down  
                <select onChange={this.handlePlaylistSelection}>
                      {this.state.userPlaylists.map(playlist => (
                        <option key={playlist.id} value={playlist.id}>
                          {playlist.title}
                        </option>
                      ))}
              </select>
              }
            </div>) 
            : 
            (<span 
              className="d-flex justify-content-between align-items-center" 
              onDoubleClick={this.handleDoubleClick}
            >
              {this.state.currentTitle}
              <svg className="bi bi-pencil-square" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
              </svg>
            </span>)}
          </h1>
          {/* List of song cards */}
          {this.state.playlist.songs.map((song, index) => (
            <div 
              className="my-1 song-card d-flex"
              onClick={() => this.handleSongSelection(song, index)}
            >
              {/* This img is where the song preview play/pause button 
              should go. Still needs input, handler, and formatting. */}
              <img 
                className="px-2 py-1 play-button"
                src="./images/play-circle.svg" 
                alt="play" 
                role="button"
              /> 
              <div 
                className="p-1 details flex-grow-1" 
                role="button" 
                data-bs-toggle="modal" 
                data-bs-target={"#song-details-"+this.props.service} 
              >
                <h2 className="m-0">{song.tracks[0].title}</h2>
                <p className="m-0">{song.tracks[0].artist}</p>
                
              </div>
            </div>
            
          ))}

          {/* This modal pops up when you click on a song */}
          <SongDetailsModal 
            service={this.props.service}
            song={this.state.selectedSong} 
            updatePlaylist={this.handleUpdate}
            
          />

          {/* Upload the playlist to YT */}
          <button 
            className="mt-3 btn btn-secondary" 
            onClick={this.handleSave}
          >
            Save Playlist
          </button>
          
        </div>
      );

    } else {
      return null;
    }
  }
}

export default PlaylistYT;