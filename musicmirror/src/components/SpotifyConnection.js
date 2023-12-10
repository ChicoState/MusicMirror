import * as auth from "../auth";
import React from "react";

class SpotifyConnection extends React.Component {
  constructor() {
    super();
    const loggedIn = sessionStorage.getItem("loggedIn") === "true";
    this.state = {
      loggedIn: loggedIn,
      connected: false,
    }
  }

  /*--- COMPONENT LIFECYCLE FUNCS --------------------------------------------*/

  componentDidMount() {
    this.props.handleLogin(this.state.loggedIn);
  }

  /*--- HANDLERS -------------------------------------------------------------*/

  handleChange = async() => {
    auth.checkCode();
  };

  // handleAuth = async() => {
  //   auth.checkCode();
  //   this.setState({connected: true}, () => {
  //     console.log("SPOTIFY STATE UPDATE COMPLETE {connected: true}");
  //   });
  // }

  /*--------------------------------------------------------------------------*/

  render() {
    if(sessionStorage.getItem("loggedIn") !== "true"){
      return (
        <section id="spot-connection" className="service-connection mt-3 pt-3">
          <h3 className="m-0">Looks like you haven't connected to Spotify yet. Please sign in.</h3>
          <button className="mt-3 btn btn-secondary" onClick={this.handleChange}>Sign in with Spotify!</button>
        </section>
      );
    }else{
      console.log("loggedIn: ", sessionStorage.getItem("loggedIn"));
      return (
        <section id="spot-connection" className="service-connection mt-3 pt-3 d-flex justify-content-between align-items-center">
          <h3 className="m-0 logged-in">Spotify Connected!</h3>
          <button className="btn btn-secondary" onClick={auth.signOut}>Sign out</button>
        </section>
      );
    }
  }
}

export default SpotifyConnection;