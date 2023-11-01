import { genPlaylist } from "../playlist";
// import "../styles/Playlist.css";
import React from "react";
import SongDetailsModal from "./SongDetailsModal";

class Playlist extends React.Component{
  constructor(){
    super();
    this.state = {
      playlist: {},
      isEditing: false,
      currentTitle: "Music Mirror Playlist",
      selectedSong: {},
      selectedIndex: null,
      search: 1,
    };
  }

  /*--- HANDLERS -------------------------------------------------------------*/

  handleBlur = () => {
    console.log("handleBlur");
    this.setState({ isEditing: false });
    // Call a function passed as a prop to update the list title
    this.onTitleChange(this.state.currentTitle);
  };


  handleChange = (e) => {
    console.log("handleChange");
    this.setState({ currentTitle: e.target.value });
  };


  handleDoubleClick = (two) => {
    console.log("handleDoubleClick");
    if (two === 2) {
      this.setState({ isEditing: true }, () => {
        console.log("Now editing!");
      });
    }
  };


  /* Note which song card was clicked on */
  handleSongSelection = (song, index) => {
    this.setState({selectedSong: song, selectedIndex: index});
    console.log(`selected song: ${song.tracks[0].title}`);
  };


  onTitleChange = (newTitle) => {
    console.log("onTitleChange");
    const newList = {...this.state.playlist};
    newList.title = this.state.currentTitle;
    this.setState({playlist: newList});
    console.log("Title has been changed!");
    // this.props.list.title = newTitle;
  };


  /* Update or delete a song card */
  handleUpdate = (updatedSong) => {
    const newList = {...this.state.playlist};

    /* If passed nothing, remove the currently selected song */
    if (!updatedSong) {
      newList.songs = newList.songs.filter((song, index) => 
        index !== this.state.selectedIndex
      );
      this.setState({playlist: newList});
      console.log("REMOVED LIST ITEM");
      console.log(newList);

    /* If passed a song, replace the currently selected song */
    } else {
      newList.songs[this.state.selectedIndex] = updatedSong;
      this.setState({playlist: newList, selectedSong: updatedSong});
    }
  };

  /*--------------------------------------------------------------------------*/

  render() {

    /* Update state.playlist if a new search occurred.
    This should technically be handled in componentDidUpdate(), but for the
    life of me I couldn't get it to work without spawning an infinite loop. */
    if (this.props.list &&
        this.state.playlist &&
        this.props.search === this.state.search) {
      console.log("New search, updating state!");
      this.setState({playlist: this.props.list, search: this.props.search+1});
    }

      
    /* If there are no songs to display, instruct users to add songs */
    if (!this.props.list || 
        !this.state.playlist ||
        Object.keys(this.state.playlist).length === 0 ||
        (Object.keys(this.state.playlist).length > 0 &&
        this.state.playlist.songs.length === 0)) {

      return (
        <div className="Playlist mt-3">
          <h1>Choose a playlist to preview, or create a new one.</h1>
        </div>
      );
    
    /* If there are songs to display, render song cards */
    } else if (this.state.playlist && 
        Object.keys(this.state.playlist).length > 0) {
      return (
        <div className="Playlist mt-3">
          <h1 className="d-flex justify-content-between">
            {/* {this.state.isEditing ? 
            (<input type="text" value={this.state.currentTitle} onChange={this.handleChange} onBlur={this.handleBlur} autoFocus/>) : 
            (<span className="d-flex justify-content-between" onDoubleClick={this.handleDoubleClick}>{this.state.currentTitle}</span>)} */}
            {this.state.currentTitle}
            {/* Pencil icon: If we get the commented code above to work,
            this should be moved inside the span. */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
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
                data-bs-target="#song-details" 
              >
                <h2 className="m-0">{song.tracks[0].title}</h2>
                <p className="m-0">{song.tracks[0].artist}</p>
              </div>
            </div>
          ))}

          {/* This modal pops up when you click on a song */}
          <SongDetailsModal 
            song={this.state.selectedSong} 
            updatePlaylist={this.handleUpdate}
          />

          {/* Upload the playlist to Spotify */}
          <button 
            className="mt-3 btn btn-secondary" 
            onClick={() => genPlaylist(this.state.playlist)}
          >
            Confirm Playlist
          </button>
        </div>
      );

    } else {
      return null;
    }
  }
}

export default Playlist;