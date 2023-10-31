import { genPlaylist } from '../playlist';
import '../styles/Playlist.css';
import React from 'react';
import SongDetailsModal from './SongDetailsModal';

class Playlist extends React.Component{
  constructor(){
    super();
    this.state = {
      playlist: {},
      isEditing: false,
      currentTitle: "Music Mirror Playlist",
      selectedSong: {},
    };
  }

  handleDoubleClick = () => {
    this.setState({ isEditing: true });
  };

  handleBlur = () => {
    this.setState({ isEditing: false });
    // Call a function passed as a prop to update the list title
    this.onTitleChange(this.state.currentTitle);
  };

  onTitleChange = (newTitle) => {
    this.props.list.title = newTitle;
  };

  handleChange = (e) => {
    this.setState({ currentTitle: e.target.value });
  };

  handleSongSelection = (song) => {
    this.setState({selectedSong: song});
    console.log(`selected song: ${song.tracks[0].title}`);
  };

  render() {
    const { currentTitle, isEditing } = this.state;
    if (!this.props.list) {
      return (
        <div className="Playlist-container mt-5">
          <h1>Add songs to preview playlist</h1>
        </div>
      );
    } else if (this.props.list.songs && Object.keys(this.props.list.songs).length > 0) {
      return (
        <div className="Playlist-container mt-5 py-2">
          <h1>
            {isEditing ? (<input type="text" value={currentTitle} onChange={this.handleChange} onBlur={this.handleBlur} autoFocus/>) : (<span onDoubleClick={this.handleDoubleClick}>{currentTitle}</span>)}
          </h1>
          {/* List of song cards */}
          {this.props.list.songs.map((song) => (
            <div className="my-1 song-card d-flex">
              {/* This img is where the song preview play/pause button 
              should go. Still needs input, handler, and formatting. */}
              <img src="./images/play-circle.svg" alt="play" className="px-2 py-1 play-button" onClick="" role="button"/> 
              <div className="p-1 details flex-grow-1" role="button" onClick={() => this.handleSongSelection(song)} data-bs-toggle="modal" data-bs-target="#song-details">
                <h2 className="m-0">{song.tracks[0].title}</h2>
                <p className="m-0">{song.tracks[0].artist}</p>
              </div>
            </div>
          ))}

          {/* This modal pops up when you click on a song */}
          <div id="song-details" className="modal fade" tabindex="-1" aria-hidden="true">
            <SongDetailsModal song={this.state.selectedSong}/>
          </div>

          <button className="m-2 px-5 btn btn-secondary" onClick={() => genPlaylist(this.props.list)}>Confirm Playlist</button>
        </div>
      );

    } else {
      return null;
    }
  }
}

export default Playlist;