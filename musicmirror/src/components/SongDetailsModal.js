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








  // <div id="carouselExampleIndicators" class="carousel slide">
  //   <div class="carousel-indicators">
  //     <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
  //     <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
  //     <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  //   </div>
  //   <div class="carousel-inner">
  //     <div class="carousel-item active">
  //       <img src="..." class="d-block w-100" alt="...">
  //     </div>
  //     <div class="carousel-item">
  //       <img src="..." class="d-block w-100" alt="...">
  //     </div>
  //     <div class="carousel-item">
  //       <img src="..." class="d-block w-100" alt="...">
  //     </div>
  //   </div>
  //   <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
  //     <span class="carousel-control-prev-icon" aria-hidden="true"></span>
  //     <span class="visually-hidden">Previous</span>
  //   </button>
  //   <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
  //     <span class="carousel-control-next-icon" aria-hidden="true"></span>
  //     <span class="visually-hidden">Next</span>
  //   </button>
  // </div>










    return (
      <div className="modal-dialog modal-lg modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            <div className="searchbox input-group">
              <input className="form-control input-group-text" id="textInput" type="search" aria-label="refine search" placeholder={song.query} onChange={this.handleChange} value={this.message} />
              <img src="./images/search.svg" alt="search" className="btn btn-info" onClick={this.handleSubmit} role="button"/>
            </div>
            <button className="ms-2 btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>



          <div id="details-carousel" className="modal-body carousel slide">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#details-carousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Search Result 1"></button>
              <button type="button" data-bs-target="#details-carousel" data-bs-slide-to="1" className="" aria-current="true" aria-label="Search Result 2"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="mb-2 details-header d-flex align-items-center">
                  <img src="./images/play-circle.svg" alt="play" className="play-button" onClick="" role="button"/>
                  <h1 className="mx-2 mb-0">{song.title}</h1>
                  <p className="mb-0 song-length">({song.length})</p>
                </div>
                <p className="d-flex justify-content-between">
                  <div>Artist:&nbsp;</div>
                  <div>{song.artist}</div>
                </p>
                <p className="d-flex justify-content-between">
                  <div>Album:&nbsp;</div>
                  <div>{song.album}</div>
                </p>
              </div>
              <div className="carousel-item">
                <p>
                  testing, testing, 123... i'm typing a really really long string here 
                  testing, testing, 123... i'm typing a really really long string here
                  testing, testing, 123... i'm typing a really really long string here
                  testing, testing, 123... i'm typing a really really long string here
                  testing, testing, 123... i'm typing a really really long string here
                  testing, testing, 123... i'm typing a really really long string here
                  testing, testing, 123... i'm typing a really really long string here
                  testing, testing, 123... i'm typing a really really long string here
                  testing, testing, 123... i'm typing a really really long string here
                  testing, testing, 123... i'm typing a really really long string here
                  testing, testing, 123... i'm typing a really really long string here
                  testing, testing, 123... i'm typing a really really long string here
                </p>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#details-carousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#details-carousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
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