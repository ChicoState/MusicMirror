import * as youtube from "../youtube";
import React from "react";

class YouTubeConnection extends React.Component {
  constructor() {
    super();
    const loggedIn = sessionStorage.getItem("loggedInYT") === "true";
    this.state = {
      loggedIn: loggedIn,
      connected: false,
    }

    if (sessionStorage.getItem("ytTokenNeedsProcessing") === "true") {
      // store the user's youtube auth token for reference
      sessionStorage.setItem("ytTokenNeedsProcessing", "false");
      youtube.signIn();
    }
  }

  /*--- COMPONENT LIFECYCLE FUNCS --------------------------------------------*/

  componentDidMount() {
    this.props.handleLogin(this.state.loggedIn);
  }

  /*--- HANDLERS -------------------------------------------------------------*/

  handleSignIn = async() => {
    // This var lets us know we've retrieved a token from Google and need to
    // finish the sign in process once we've been redirected back to MusicMirror
    sessionStorage.setItem("ytTokenNeedsProcessing", "true");
    await youtube.signIn();
    this.props.handleLogin(true);
  }

  handleSignOut = async() => {
    youtube.signOut();
    this.props.handleLogin(false);
  }

  /*--------------------------------------------------------------------------*/

  render() {
    if(sessionStorage.getItem("loggedInYT") !== "true"){
      return (
        <section  id="yt-connection" className="service-connection mt-3 pt-3">
          <h3 className="m-0">Looks like you haven't connected to YouTube yet. Please sign in.</h3>
          <button className="mt-3 btn btn-secondary" onClick={this.handleSignIn}>Sign in with YouTube!</button>
        </section>
      );
    }else{
      return (
        <section  id="yt-connection" className="service-connection mt-3 pt-3 d-flex justify-content-between align-items-center">
          <h3 className="m-0 logged-in">YouTube Connected!</h3>
          <button className="btn btn-secondary" onClick={this.handleSignOut}>Sign out</button>
        </section>
      );
    }
  }
}

export default YouTubeConnection;