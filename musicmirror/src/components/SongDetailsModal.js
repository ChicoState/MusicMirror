import '../styles/Modal.css';
import React from 'react';

class SongDetailsModal extends React.Component{
  constructor(){
    super();
    this.state = {
      message: '',
      trackIndex: 0,
    };
  }

  componentDidUpdate(prevProps) {

    /* Make sure the trackIndex resets whenever a new song is passed */
    if (prevProps.song !== this.props.song) {
      this.setState({trackIndex: 0});
    }
  }

  handleChange = event => {
    this.setState({message: event.target.value});
    console.log(event.target.value);
    console.log(this.state.message);
  };

  handleSubmit = async() => {
    console.log(`passing: ${this.state.message}`)
  };

  handleTrackIter = (index) => {
    if (index === "next" && this.state.trackIndex === this.props.song.tracks.length-1) {
      this.setState({trackIndex: 0});
    } else if (index === "next") {
      this.setState({trackIndex: this.state.trackIndex+1});
    } else if (index === "prev" && this.state.trackIndex === 0) {
      this.setState({trackIndex: this.props.song.tracks.length-1});
    } else if (index === "prev") {
      this.setState({trackIndex: this.state.trackIndex-1});
    } else {
      this.setState({trackIndex: index});
    }
  }

  handleConfirm = () => {
    if (this.state.trackIndex !== 0) {
      let chosenTrack = this.props.song.tracks[this.state.trackIndex];
      this.props.song.tracks = [
        chosenTrack,
        ...this.props.song.tracks.slice(0, this.state.trackIndex),
        ...this.props.song.tracks.slice(this.state.trackIndex + 1)
      ];
    } 
    this.props.updatePlaylist(this.props.song);
  };

  render() {

    const song = this.props.song;

    if (!song) {
      return (
        <div id="song-details" className="modal fade" tabindex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header"></div>
              <div className="modal-body"></div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id="song-details" className="modal fade" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-fullscreen-sm-down">
          <div className="modal-content">
            <div className="modal-header">
              <div className="searchbox input-group">
                <input className="form-control input-group-text" id="textInput" type="search" aria-label="refine search" placeholder={song.query} onChange={this.handleChange} value={this.message} />
                <img src="./images/search.svg" alt="search" className="btn btn-info" onClick={this.handleSubmit} role="button"/>
              </div>
              <button className="ms-2 btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            {/* This section handles search result slides */}
            <div id="details-carousel" className="modal-body carousel slide">
              <div className="carousel-indicators">
                {song.tracks && song.tracks.map((track, index) => (
                  <button type="button" data-bs-target="#details-carousel" data-bs-slide-to={index} className={index === 0 ? "active" : ""} aria-current={index === 0 ? "true" : ""} aria-label={`Search Result ${index+1}`} onClick={() => this.handleTrackIter(index)}></button>
                ))}
              </div>
              <div className="carousel-inner">
                {song.tracks && song.tracks.map((track, index) => (
                  <div className={`carousel-item ${index === 0 ? "active" : ""}`}>
                    <div className="mb-2 details-header d-flex align-items-center">
                      {/* This img is where the song preview play/pause button 
                      should go. Still needs input, handler, and formatting. */}
                      <img src="./images/play-circle.svg" alt="play" className="play-button" onClick="" role="button"/>
                      <h1 className="mx-2 mb-0">{track.title}</h1>
                      <p className="mb-0 song-length">({track.length})</p>
                    </div>
                    <p className="d-flex justify-content-between">
                      <div>Artist:&nbsp;</div>
                      <div>{track.artist}</div>
                    </p>
                    <p className="d-flex justify-content-between">
                      <div>Album:&nbsp;</div>
                      <div>{track.album}</div>
                    </p>
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#details-carousel" data-bs-slide="prev" onClick={() => this.handleTrackIter("prev")}>
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#details-carousel" data-bs-slide="next" onClick={() => this.handleTrackIter("next")}>
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            {/* End search result slides */}

            <div className="modal-footer d-flex">
              <button type="button" className="btn btn-success flex-fill" data-bs-dismiss="modal" onClick={() => this.handleConfirm()}>
                Confirm Selection
              </button>
              <button type="button" className="btn btn-danger flex-fill" data-bs-dismiss="modal" onClick={() => this.props.updatePlaylist(null)}>
                Remove Song
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SongDetailsModal;