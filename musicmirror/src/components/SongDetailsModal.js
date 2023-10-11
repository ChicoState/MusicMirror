import '../styles/Modal.css';
import React from 'react';

class SongDetailsModal extends React.Component{
  constructor(){
    super();
    this.state = {
      message: '',
    };
  }

  handleChange = event => {
    this.setState({message: event.target.value});
    console.log(event.target.value);
    console.log(this.state.message);
  };

  handleSubmit = async() => {
    this.props.handleMsg(this.state.message);
    console.log(`passing: ${this.state.message}`)
  };

  render() {

    const song = this.props.song;

    return (
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div className="searchbox input-group">
              <input className="form-control input-group-text" id="textInput" type="search" aria-label="refine search" onChange={this.handleChange} value={this.message} placeholder="" />
              <img src="./images/search.svg" alt="search" className="btn btn-info" onClick={this.handleSubmit} role="button"/>
            </div>
            <button className="ms-2 btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
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
          </div>
          <div className="modal-footer d-flex">
            <button type="button" className="btn btn-success flex-fill" data-bs-dismiss="modal">Confirm Selection</button>
            <button type="button" className="btn btn-danger flex-fill">Remove Song</button>
          </div>
        </div>
      </div>
    );
  }
}

export default SongDetailsModal;