import React from "react";

class YouTube extends React.Component {
  constructor(){
    super();
    this.state = {
      connected: false,
    };
  }

  /*--- HANDLERS -------------------------------------------------------------*/

  handleAuth = async() => {
    // auth.checkCode();
    // this.setState({connected: true});
    console.log("calling YouTube handleAuth");
  }

  /*--------------------------------------------------------------------------*/

  render() {

    if (!this.state.connected) {
      return (
        <div className="YouTube">
          <h3 className="">
            Looks like you haven't connected to YouTube Music yet. Please Sign In.
          </h3>
          <button className="my-3 btn btn-secondary" onClick={this.handleAuth}>
            Sign in with YouTube Music!
          </button>
        </div>
      )
    }

    else {
      return (
        <div className="YouTube">
          <h3 className="">YouTube Music Connected!</h3>
          <ul>
            <li className="d-flex justify-content-between">
              Username:&nbsp;
              <div id="displayName" className="profile-info"></div>
            </li>
            <li className="d-flex justify-content-between">
              User ID:&nbsp;
              <div id="id" className="profile-info"></div>
            </li>
            <li className="d-flex justify-content-between">
              Email:&nbsp;
              <div id="email" className="profile-info"></div>
            </li>
            {/* If profile image gets added later, id="imgUrl". */}
          </ul>
        </div>
      );
    }
  }
}

export default YouTube;
