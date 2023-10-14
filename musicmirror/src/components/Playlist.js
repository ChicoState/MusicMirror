import { genPlaylist } from '../playlist';
import '../styles/Playlist.css';
import React from 'react';

class Playlist extends React.Component{
  constructor(){
    super();
    this.state = {
      playlist: {},
      isEditing: false,
      currentTitle: "Music Mirror Playlist",
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

  render() {
    const { currentTitle, isEditing } = this.state;
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
              <div> 
                {isEditing ? (<input type="text" value={currentTitle} onChange={this.handleChange} onBlur={this.handleBlur} autoFocus/>) : (<span onDoubleClick={this.handleDoubleClick}>{currentTitle}</span>)}
              </div>
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