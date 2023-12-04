import * as auth from "../auth";
import React from "react";

class SpotifyProfile extends React.Component {
  constructor() {
    super();
    //const loggedIn = localStorage.getItem("loggedIn") === "true";
    const loggedIn = sessionStorage.getItem("loggedIn") === "true";
    this.state = {
      loggedIn: loggedIn,
      connected: false,
      //loggedIn: false,
    }
  }

  componentDidMount() {
    //localStorage.setItem('loggedIn', true);
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
    //if(!this.state.loggedIn){
    //if(localStorage.getItem("loggedIn") === "false"){
    if(sessionStorage.getItem("loggedIn") === "false"){
      return (
        <section id="profile" className="SpotifyProfile">
        <h3>Looks like you haven't connected to Spotify yet. Please sign in.</h3>
        {/*
        <ul>
          <li className="d-flex justify-content-between">User ID:&nbsp;<div id="id" className="profile-info"></div></li>
          <li className="d-flex justify-content-between">Email:&nbsp;<div id="email" className="profile-info"></div></li>
           <li className="d-flex justify-content-between">Profile Image:&nbsp;<div id="imgUrl"></div></li>
        </ul>*/}
        <button className="my-3 btn btn-secondary" onClick={this.handleChange}>Sign in with Spotify!</button>
      </section>
      );
    }else{
      console.log("loggedIn: ", sessionStorage.getItem("loggedIn"));
      return (
        <section id="profile" className="SpotifyProfile">
        <h3 className="logged-in">Spotify Connected!</h3>
        <button className="my-3 btn btn-secondary" onClick={auth.signOut}>Sign out</button>
      </section>
      );
    }
  }
}

export default SpotifyProfile;