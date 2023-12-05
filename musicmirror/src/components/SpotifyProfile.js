import * as auth from "../auth";
import React from "react";

class SpotifyProfile extends React.Component {
  constructor() {
    super();
    const loggedIn = sessionStorage.getItem("loggedIn") === "true";
    this.state = {
      loggedIn: loggedIn,
      connected: false,
    }
  }

  componentDidMount() {
    this.props.handleLogin(this.state.loggedIn);
  }

  handleChange = async() => {
    auth.checkCode();

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
    if(sessionStorage.getItem("loggedIn") === "false"){
      return (
        <section id="profile" className="SpotifyProfile mb-3">
          <h3>Looks like you haven't connected to Spotify yet. Please sign in.</h3>
          <button className="my-3 btn btn-secondary" onClick={this.handleChange}>Sign in with Spotify!</button>
        </section>
      );
    }else{
      console.log("loggedIn: ", sessionStorage.getItem("loggedIn"));
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