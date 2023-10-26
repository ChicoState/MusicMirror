import { genPlaylist } from '../playlist';
import '../styles/Playlist.css';
import React from 'react';
import SongDetailsModal from './SongDetailsModal';

class Playlist extends React.Component{
  constructor(){
    super();
    this.state = {
      playlist: {},
      selectedSong: {},
      selectedIndex: null,
    };
  }

  handleSongSelection = (song, index) => {
    this.setState({selectedSong: song});
    this.setState({selectedIndex: index});
    console.log(`selected song: ${song.tracks[0].title}`);
  };

  handleUpdate = (updatedSong) => {
    let newList = this.props.list;

    /* If passed nothing, remove the currently selected song */
    if (!updatedSong) {
      newList.songs.splice(this.state.selectedIndex, 1);
      this.setState({selectedSong: {}});
      this.setState({selectedIndex: null});

    /* If passed a song, replace the currently selected song */
    } else {
      console.log(updatedSong);
      newList.songs[this.state.selectedIndex] = updatedSong;
      this.setState({selectedSong: updatedSong});
    }
  };

  render() {
    if (!this.props.list) {
      return (
        <div className="Playlist-container mt-5">
          <h1>Add songs to preview playlist</h1>
        </div>
      );
    } else if (this.props.list.songs && Object.keys(this.props.list.songs).length > 0) {
      return (
        <div className="Playlist-container mt-5 py-2">
          <h1>{this.props.list.title}</h1>

          {/* List of song cards */}
          {this.props.list.songs.map((song, index) => (
            <div className="my-1 song-card d-flex">
              {/* This img is where the song preview play/pause button 
              should go. Still needs input, handler, and formatting. */}
              <img src="./images/play-circle.svg" alt="play" className="px-2 py-1 play-button" onClick="" role="button"/> 
              <div className="p-1 details flex-grow-1" role="button" onClick={() => this.handleSongSelection(song, index)} data-bs-toggle="modal" data-bs-target="#song-details">
                <h2 className="m-0">{song.tracks[0].title}</h2>
                <p className="m-0">{song.tracks[0].artist}</p>
              </div>
            </div>
          ))}

          {/* This modal pops up when you click on a song */}
          <SongDetailsModal song={this.state.selectedSong} updatePlaylist={this.handleUpdate}/>

          <button className="m-2 px-5 btn btn-secondary" onClick={() => genPlaylist(this.props.list)}>Confirm Playlist</button>
        </div>
      );

    } else {
      return null;
    }
  }
}

export default Playlist;