import * as auth from '../auth';
import '../styles/SpotifyProfile.css';

function SpotifyProfile() {
  return (
    <section id="profile">
      <h3>Logged in to Spotify as <div id="displayName"></div></h3>
      <ul>
        <li>User ID: <div id="id"></div></li>
        <li>Email: <div id="email"></div></li>
        <li>Profile Image: <div id="imgUrl"></div></li>
      </ul>
      <button className="btn btn-secondary" onClick={auth.checkCode}>Sign in to Spotify</button>
    </section>
  );
}

export default SpotifyProfile;