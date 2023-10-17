import * as auth from '../auth';
import '../styles/SpotifyProfile.css';

export function SpotifyProfile() {
  return (
    <section id="profile">
      <h3 className="d-flex justify-content-center" color='white'>Logged into Spotify as&nbsp;<div id="displayName"></div></h3>
      <ul>
        <li className="d-flex justify-content-between">User ID:&nbsp;<div id="id" className="profile-info"></div></li>
        <li className="d-flex justify-content-between">Email:&nbsp;<div id="email" className="profile-info"></div></li>
        {/* <li className="d-flex justify-content-between">Profile Image:&nbsp;<div id="imgUrl"></div></li> */}
      </ul>
      <button className="btn btn-secondary" onClick={auth.checkCode}>Sign in to Spotify</button>
    </section>
  );
}
export default SpotifyProfile;