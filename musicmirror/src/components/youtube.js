import React, { Component } from 'react'

export default class Youtube extends Component {
  render() {
    return (
        <section id="profile">
            <h3 className="d-flex justify-content-center"> 
                Loging To Youtube:
            </h3>
            {/*The link can be removed, was trying to see if it'll just take you to youtube  */}
            <button className="" onClick={"https://accounts.google.com/ServiceLogin?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F&hl=en&ec=65620"}>Signing</button>
        </section>
    )
  }
}
