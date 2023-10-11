import { genPlaylist } from '../playlist';
import '../styles/Playlist.css';
import React from 'react';

class Playlist extends React.Component{
  constructor(){
    super();
    this.state = {
      playlist: {},
    };
  }

  render() {
    if(!this.props.list){
      return (
        <div className="Playlist-container mt-5">
        <div className="list-container">
          <h3>Add songs to preview playlist</h3>
        </div>
      </div>
      );
    }
      else if(this.props.list.songs && Object.keys(this.props.list.songs).length > 0){
        return (
          <div className="Playlist-container mt-5">
            <div className="list-container">
            <h3>{playlist.title}</h3>
            {playlist.songs.map((song) => (
              <div className="song-card">

                {/* This is what you see in the playlist */}
                <div className="song-preview d-flex">
                  <img src="./images/play-circle.svg" alt="play" className="play-button" onClick="" role="button"/> 
                  <div className="details flex-grow-1" role="button" data-bs-toggle="modal" data-bs-target="#song-details">
                    <h4>{song.title}</h4>
                    <p>{song.artist}</p>
                  </div>
                </div>

                {/* This pops up when you click on the song */}
                <div id="song-details" className="modal fade" tabindex="-1" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <div className="modal-card">
                          <div className="modal-card-header d-flex">
                            <h4>{song.title}</h4>
                            <p className="song-length">({song.length})</p>
                            <img src="./images/play-circle.svg" alt="play" className="play-button" onClick="" role="button"/>
                          </div>
                          <p>Artist: {song.artist}</p>
                          <p>Album: {song.album}</p>
                        </div>
                        <div className="search-container">
                          <label className="form-label" htmlFor="textInput">
                            <h5 className="mt-5 mb-0">Refine Search:</h5>
                          </label>
                          <div className="searchbox input-group">
                            <input className="form-control input-group-text" id="textInput" type="text" onChange={handleChange} value={message} placeholder="" />
                            <img src="./images/search.svg" alt="search" className="btn btn-info" onClick={handleClick} role="button"/>                        </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-success" data-bs-dismiss="modal">Confirm Selection</button>
                        <button type="button" className="btn btn-danger">Remove Song</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
          <button className="btn btn-secondary" onClick={() => genPlaylist(playlist)}>Confirm Playlist</button>
          </div>
        );
      }
      else{
        return null;
      }
  }
}

export default Playlist;