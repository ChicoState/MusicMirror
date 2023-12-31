import React from "react";
import { findSongs } from "../playlist";
import { performYouTubeSearch } from "../youtube";

class SongDetailsModal extends React.Component{
  constructor(){
    super();
    this.state = {
      message: "",
      song: {},
      trackIndex: 0,
      progress: false,
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
      this.setState({song: this.props.song, trackIndex: 0}, () => {
        console.log("MODAL STATE UPDATE COMPLETE {song: this.props.song, trackIndex: 0}");
        console.log(this.props.service, this.props.song);
      });
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
    this.setState({message: event.target.value}, () => {
      console.log("MODAL STATE UPDATE COMPLETE {message: event.target.value}")
    });
  };


  /* Updates the track selection */
  handleConfirm = () => {
    if (this.state.trackIndex !== 0) {
      let updatedSong = this.state.song;
      let chosenTrack = updatedSong.tracks[this.state.trackIndex];
      updatedSong.tracks = [
        chosenTrack,
        ...updatedSong.tracks.slice(0, this.state.trackIndex),
        ...updatedSong.tracks.slice(this.state.trackIndex + 1)
      ];
      this.setState({song: updatedSong}, () => {
        console.log("MODAL STATE UPDATE COMPLETE, TRACK CONFIRMED {song: updatedSong}");
      });
    } 
    this.props.updatePlaylist(this.state.song);
  };


  /* If the enter key is pressed inside the searchbox, 
  return to the first carousel slide and perform a search */
  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.target.setAttribute("data-bs-target", "#details-carousel");
      event.target.click();
      event.target.setAttribute("data-bs-target", "");
      // this.setState({progress: true});
      this.handleSearch();
    }
  }

  handleClick = (event) => {
    // this.setState({progress: true});
    this.handleSearch();
  }


  /* Perform a search and display the results */
  handleSearch = async() => {
    console.log(`searching: ${this.state.message}`);
    let newList;
    // If the selected song has Spotify data, do a Spotify search
    if (this.state.song.tracks[this.state.trackIndex].album) {
      newList = await findSongs(this.state.message, 5);
    // Otherwise do a YouTube search
    } else {
      newList = await performYouTubeSearch(this.state.message, 5);
    }
    if (newList.songs) {
      console.log("search successful");
      this.setState({song: newList.songs[0], trackIndex: 0, progress: false}, () => {
        console.log("MODAL STATE UPDATE COMPLETE, SEARCH SUCCESSFUL {song: newList.songs[0], trackIndex: 0}");
      });
    } else {
      console.log("could not perform search");
      this.setState({trackIndex: 0, progress: false}, () => {
        console.log("MODAL STATE UPDATE COMPLETE, SEARCH NOT SUCCESSFUL {trackIndex: 0}");
      });
    }
  };


  /* Update this.state.trackIndex to match which track is being displayed */
  handleTrackIter = (index) => {
    if (index === "next" && 
        this.state.trackIndex === this.props.song.tracks.length-1) {
      this.setState({trackIndex: 0}, () => {
        console.log("TRACKITER STATE UPDATE COMPLETE {trackIndex: 0}");
      });
    } else if (index === "next") {
      this.setState({trackIndex: this.state.trackIndex+1}, () => {
        console.log("TRACKITER STATE UPDATE COMPLETE {trackIndex: this.state.trackIndex+1}");
      });
    } else if (index === "prev" && this.state.trackIndex === 0) {
      this.setState({trackIndex: this.props.song.tracks.length-1}, () => {
        console.log("TRACKITER STATE UPDATE COMPLETE {trackIndex: this.props.song.tracks.length-1}");
      });
    } else if (index === "prev") {
      this.setState({trackIndex: this.state.trackIndex-1}, () => {
        console.log("TRACKITER STATE UPDATE COMPLETE {trackIndex: this.state.trackIndex-1}");
      });
    } else {
      this.setState({trackIndex: index}, () => {
        console.log("TRACKITER STATE UPDATE COMPLETE {trackIndex: index}");
      });
    }
  }

  /*--- OTHER FUNCTIONS ------------------------------------------------------*/

  /* Add a mutation observer that resets the carousel when the modal closes */
  addObserver = () => {

    const modal = document.getElementById("song-details-"+this.props.service);
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
            this.setState({message: "", song: this.props.song, trackIndex: 0}, () => {
              console.log('MUTATION OBSERVER STATE UPDATE COMPLETE {message: "", song: this.props.song, trackIndex: 0}');
            });
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
      return (
        <div 
          id={"song-details-" + this.props.service} 
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
          id={"song-details-" + this.props.service} 
          className={this.state.progress? 
            "SongDetailsModal progress-cursor modal fade" 
            : 
            "SongDetailsModal modal fade"
          }
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
                    // data-bs-target="#details-carousel" 
                    data-bs-target="" 
                    data-bs-slide-to="0"
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
                    onClick={this.handleClick}
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
                        <h1 className="mx-2 mb-0">{track.title}</h1>
                        <p className="mb-0 song-length">({track.length})</p>
                      </div>
                      {track.album?
                        <div>
                          <div className="d-flex justify-content-between">
                            <p>Artist:&nbsp;</p>
                            <p>{track.artist}</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p>Album:&nbsp;</p>
                            <p>{track.album}</p>
                          </div>
                        </div>
                        :
                        <div>
                          {/* Angel: playable youtube video goes inside this div */}
                        </div>
                      }
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