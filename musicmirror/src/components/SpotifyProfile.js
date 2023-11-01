import * as auth from '../auth';
import '../styles/SpotifyProfile.css';
import React from 'react';

class SpotifyProfile extends React.Component {
  constructor() {
    super();
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    this.state = {
      loggedIn: loggedIn,
      //loggedIn: false,
    }
  }

  componentDidMount() {
    localStorage.setItem('loggedIn', true);
    this.props.handleLogin(this.state.loggedIn);
  }

  handleChange = async() => {
    auth.checkCode();
    /*
    this.setState({loggedIn: true}, async() => {
      //localStorage.setItem('loggedIn', true);
      await this.props.handleLogin(this.state.loggedIn);
    });
    */
  };

  render() {
    if(!this.state.loggedIn){
      return (
        <section id="profile">
        <h3 className="d-flex justify-content-center">Log into Spotify&nbsp;<div id="displayName"></div></h3>
        {/*
        <ul>
          <li className="d-flex justify-content-between">User ID:&nbsp;<div id="id" className="profile-info"></div></li>
          <li className="d-flex justify-content-between">Email:&nbsp;<div id="email" className="profile-info"></div></li>
           <li className="d-flex justify-content-between">Profile Image:&nbsp;<div id="imgUrl"></div></li>
        </ul>*/}
        <button className="btn btn-secondary" onClick={this.handleChange}>Sign In</button>
      </section>
      );
    }else{
      return (
        <section id="profile">
        <h3 className="d-flex justify-content-center">Logged into Spotify&nbsp;<div id="displayName"></div></h3>
        <button className="btn btn-secondary" onClick={auth.signOut}>Sign out</button>
      </section>
      );
    }
  }
}

export default SpotifyProfile;

/*
export function SpotifyProfile() {
  return (
    <section id="profile">
      <h3 className="d-flex justify-content-center">Logged into Spotify as&nbsp;<div id="displayName"></div></h3>
      <ul>
        <li className="d-flex justify-content-between">User ID:&nbsp;<div id="id" className="profile-info"></div></li>
        <li className="d-flex justify-content-between">Email:&nbsp;<div id="email" className="profile-info"></div></li>
        //{ <li className="d-flex justify-content-between">Profile Image:&nbsp;<div id="imgUrl"></div></li> }
      </ul>
      <button className="btn btn-secondary" onClick={auth.checkCode}>Sign in to Spotify</button>
    </section>
  );
}
*/
