import React from "react";
import { findSongs } from "../playlist";

class SongDetailsModal extends React.Component{
  constructor(){
    super();
    this.state = {
      message: "",
      song: {},
      trackIndex: 0,
    };
    this.observer = null;
  }

  /*--- COMPONENT LIFECYCLE FUNCTIONS ----------------------------------------*/

  /* Called every time the state or props change */
  componentDidUpdate(prevProps, prevState) {

    /* Add a mutation observer after the DOM renders */
    if (Object.keys(prevState.song).length === 0 && 
        Object.keys(this.state.song).length > 0) {
      this.addObserver();
    }

    /* Make sure the trackIndex resets for each song */
    if (prevProps.song !== this.props.song) {
      this.setState({song: this.props.song, trackIndex: 0});
    }
  }


  /* Disconnect the observer on Unmount to prevent memory leaks */
  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /*--- HANDLERS -------------------------------------------------------------*/

  /* Updates the search bar value */
  handleChange = event => {
    this.setState({message: event.target.value});
  };


  /* Updates the track selection */
  handleConfirm = () => {
    if (!this.state.song) {
      this.setState({song: this.props.song});
    }

    if (this.state.trackIndex !== 0) {
      let updatedSong = this.state.song;
      let chosenTrack = updatedSong.tracks[this.state.trackIndex];
      updatedSong.tracks = [
        chosenTrack,
        ...updatedSong.tracks.slice(0, this.state.trackIndex),
        ...updatedSong.tracks.slice(this.state.trackIndex + 1)
      ];
      this.setState({song: updatedSong});
    } 
    this.props.updatePlaylist(this.state.song);
  };


  /* If the enter key is pressed inside the searchbox, perform a search */
  handleKeyDown = event => {
    if (event.key === "Enter") {
      this.handleSearch();
    }
  }


  /* Perform a search and display the results */
  handleSearch = async() => {
    console.log(`searching: ${this.state.message}`);
    const newList = await findSongs(this.state.message, 5);
    if (newList.songs) {
      console.log("search successful");
      this.setState({song: newList.songs[0], trackIndex: 0});
    } else {
      console.log("could not perform search");
      this.setState({trackIndex: 0});
    }
  };


  /* Update this.state.trackIndex to match which track is being displayed */
  handleTrackIter = (index) => {
    if (index === "next" && 
        this.state.trackIndex === this.props.song.tracks.length-1) {
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

  /*--- OTHER FUNCTIONS ------------------------------------------------------*/

  /* Add a mutation observer that resets the carousel when the modal closes */
  addObserver = () => {

    const modal = document.getElementById("song-details");
    const indicators = document.querySelectorAll(".carousel-indicators > button");
    const slides = document.querySelectorAll(".carousel-item");
    
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && 
            mutation.attributeName === "aria-hidden") {
          if (modal.getAttribute("aria-hidden")){
            indicators.forEach((indicator) => {
              if (indicator.getAttribute("data-bs-slide-to") === "0"){
                indicator.classList.add("active");
                indicator.setAttribute("aria-current", "true");
              } else {
                indicator.classList.remove("active");
                indicator.setAttribute("aria-current", "false");
              }
            });
            slides.forEach((slide) => {
              if (slide.getAttribute("data-index") === "0") {
                slide.classList.add("active");
              } else {
                slide.classList.remove("active");
              }
            });
            this.setState({message: "", song: this.props.song, trackIndex: 0});
          }
        }
      });
    });

    this.observer.observe(modal, {
      attributes: true,
      attributeFilter: ["aria-hidden"]
    });
  }

  /*--------------------------------------------------------------------------*/

  render() {

    if (!this.state.song || Object.keys(this.state.song).length === 0) {
      this.setState({song: this.props.song});
      return (
        <div 
          id="song-details" 
          className="SongDetailsModal modal fade" 
          tabIndex="-1" 
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header"></div>
              <div className="modal-body"></div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      );

    } else {
      return (
        <div 
          id="song-details" 
          className="SongDetailsModal modal fade" 
          tabIndex="-1" 
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <div className="searchbox input-group">
                  <input 
                    id="textInput"
                    className="form-control input-group-text" 
                    type="search" 
                    aria-label="refine search" 
                    placeholder={this.props.song.query} 
                    value={this.state.message} 
                    onChange={this.handleChange} 
                    onKeyDown={this.handleKeyDown}
                  />
                  <img 
                    className="btn btn-info"
                    src="./images/search.svg" 
                    alt="search" 
                    role="button" 
                    data-bs-target="#details-carousel" 
                    data-bs-slide-to="0"
                    onClick={this.handleSearch}
                  />
                </div>
                <button 
                  className="ms-2 btn-close btn-close-white" 
                  type="button" 
                  data-bs-dismiss="modal" 
                  aria-label="Close"
                ></button>
              </div>

              {/* This section handles search result slides */}
              <div id="details-carousel" className="modal-body carousel slide">
                <div className="carousel-indicators">
                  {this.state.song && this.state.song.tracks.map((track, index) => (
                    <button 
                      className={index === 0 ? "active" : ""}
                      type="button" 
                      data-bs-target="#details-carousel" 
                      data-bs-slide-to={index} 
                      aria-current={index === 0 ? "true" : ""} 
                      aria-label={`Search Result ${index+1}`} 
                      onClick={() => this.handleTrackIter(index)}
                    ></button>
                  ))}
                </div>
                <div className="carousel-inner">
                  {/* Add check for additional array if second array is used */}
                  {this.state.song && this.state.song.tracks.map((track, index) => (
                    <div 
                      className={`carousel-item ${index === 0 ? "active" : ""}`} 
                      data-index={index}
                    >
                      <div className="mb-2 details-header d-flex align-items-center">
                        {/* This img is where the song preview play/pause button 
                        should go. Still needs input, handler, and formatting. */}
                        <img 
                          className="play-button"
                          src="./images/play-circle.svg" 
                          alt="play" 
                          role="button"
                        />
                        <h1 className="mx-2 mb-0">{track.title}</h1>
                        <p className="mb-0 song-length">({track.length})</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Artist:&nbsp;</p>
                        <p>{track.artist}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Album:&nbsp;</p>
                        <p>{track.album}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="carousel-control-prev" 
                  type="button" 
                  data-bs-target="#details-carousel" 
                  data-bs-slide="prev" 
                  onClick={() => this.handleTrackIter("prev")}
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button 
                  className="carousel-control-next" 
                  type="button" 
                  data-bs-target="#details-carousel" 
                  data-bs-slide="next" 
                  onClick={() => this.handleTrackIter("next")}
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
              {/* End search result slides */}

              <div className="modal-footer d-flex">
                <button 
                  className="confirm-button btn btn-secondary flex-fill"
                  type="button" 
                  data-bs-dismiss="modal" 
                  onClick={() => this.handleConfirm()}
                >
                  Confirm Selection
                </button>
                <button 
                  className="remove-button btn btn-secondary flex-fill"
                  type="button" 
                  data-bs-dismiss="modal" 
                  onClick={() => this.props.updatePlaylist(null)}
                >
                  Remove Song
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default SongDetailsModal;