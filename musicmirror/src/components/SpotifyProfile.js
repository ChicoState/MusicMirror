import * as auth from "../auth";
import React from "react";

class SpotifyProfile extends React.Component {
  constructor() {
    super();
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    this.state = {
      loggedIn: loggedIn,
      connected: false,
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

  /*--- HANDLERS -------------------------------------------------------------*/

  handleAuth = async() => {
    auth.checkCode();
    this.setState({connected: true}, () => {
      console.log("SPOTIFY STATE UPDATE COMPLETE {connected: true}");
    });
  }

  /*--------------------------------------------------------------------------*/

  render() {
    if(!this.state.loggedIn){
      return (
        <section id="profile" className="SpotifyProfile mb-3">
          <h3>Looks like you haven't connected to Spotify yet. Please sign in.</h3>
          <button className="my-3 btn btn-secondary" onClick={this.handleChange}>Sign in with Spotify!</button>
        </section>
      );
    }else{
      return (
        <section id="profile" className="SpotifyProfile mb-3 d-flex justify-content-between align-items-center">
          <h3 className="logged-in">Spotify Connected!</h3>
          <button className="my-3 btn btn-secondary" onClick={auth.signOut}>Sign out</button>
        </section>
      );
    }
  }
}

export default SpotifyProfile;