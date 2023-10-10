import '../styles/AddSongs.css';
import React from 'react';

class AddSongs extends React.Component {
  constructor() {
    super();
    this.state = {
      list: { title: "Music Mirror Playlist", songs: [] },
      message: '',
      showPlaylist: true,
    }
  }

  getPlaylist() {
    return JSON.stringify(this.list);
  };

  handleChange = event => {
    this.setState({message: event.target.value});
    console.log(event.target.value);
    console.log(this.state.message);
  };

  handleClick = async() => {
    this.props.handleMsg(this.state.message);
    console.log(`passing: ${this.state.message}`)
  };

  render() {
    return (
      // add path to form-handler inside action attribute
      <div className="container p-4 col">
        <div className="">
          <label className="form-label" htmlFor="fileInput">
            <h3 className="mb-2">Click to upload files:</h3>
            <img className="p-2" src="./images/upload.png" alt="upload area" />
            <input className="upload" type="file" id="fileInput" name="fileInput" accept="audio/*" multiple />
          </label>
        </div>
        <div className="">
          <label className="form-label" htmlFor="textInput">
            <h3 className="mt-5 mb-0">Or enter new songs here:</h3>
          </label>
          <textarea className="form-control" id="textInput" rows="5" onChange={this.handleChange} value={this.message} placeholder="Type each song on its own line."></textarea>
        </div>
        <button className="mt-5 btn btn-secondary" onClick={this.handleClick}>Find Songs</button>
      </div>
    );
  };
};

export default AddSongs;