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
              <h3>{this.props.list.title}</h3>
              <ol className="">
                  {this.props.list.songs.map((song) => (
                    <li className="">{song.title} | {song.artist} | {song.album} | {song.length}</li>
                  ))}
                </ol>
            </div>
            <button className="btn btn-secondary" onClick={() => genPlaylist(this.props.list)}>Create Playlist</button>
          </div>
        );
      }
      else{
        return null;
      }
  }
}

export default Playlist;