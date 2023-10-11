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
    };
  }

  handleSongSelection = (song) => {
    this.setState({selectedSong: song});
    console.log(`selected song: ${song.title}`);
  };

  render() {
    if (!this.props.list) {
      return (
        <div className="Playlist-container mt-5">
          <div className="list-container">
            <h1>Add songs to preview playlist</h1>
          </div>
        </div>
      );
    } else if (this.props.list.songs && Object.keys(this.props.list.songs).length > 0) {
      return (
        <div className="Playlist-container mt-5 py-2">
          <h1>{this.props.list.title}</h1>

          {/* List of song cards */}
          {this.props.list.songs.map((song) => (
            <div className="my-1 song-card d-flex">
              <img src="./images/play-circle.svg" alt="play" className="px-2 py-1 play-button" onClick="" role="button"/> 
              <div className="p-1 details flex-grow-1" role="button" onClick={() => this.handleSongSelection(song)} data-bs-toggle="modal" data-bs-target="#song-details">
                <h2 className="m-0">{song.title}</h2>
                <p className="m-0">{song.artist}</p>
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