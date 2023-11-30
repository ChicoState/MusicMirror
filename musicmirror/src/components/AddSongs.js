import React from "react";
import { run } from "../mongo";

class AddSongs extends React.Component {
  constructor() {
    super();
    this.state = {
      list: { title: "Music Mirror Playlist", songs: [] },
      message: "",
      showPlaylist: true,
    }
  }

  getPlaylist() {
    return JSON.stringify(this.list);
  };

  handleChange = event => {
    this.setState({message: event.target.value}, () => {
      console.log("ADDSONGS STATE UPDATE COMPLETE {message: event.target.value}");
    });
  };

  handleClick = async () => {
    run();
    //this.props.handleMsg(this.state.message);
    console.log(`passing: ${this.state.message}`)
  };

  render() {
    return (
      <div className="AddSongs container p-0">
        <div className="">
          <label className="form-label" htmlFor="textInput" >
            <h3 className="m-0">Search for songs to create a playlist:</h3>
          </label>
          <textarea className="form-control" id="textInput" rows="5" onChange={this.handleChange} value={this.message} placeholder="Type each song on its own line."></textarea>
        </div>
        <button className="mt-3 btn btn-secondary" onClick={this.handleClick}>Find Songs</button>
      </div>
    );
  };
};

export default AddSongs;