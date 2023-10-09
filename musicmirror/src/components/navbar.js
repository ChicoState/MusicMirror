
import SpotifyProfile from "./SpotifyProfile"
export default function Navbar() {
    return (<nav className ="nav">
        <a heref="/" className="MusicMirror"> MusicMirror</a>
        <ul>
            <li>
                <a href="/Home">Home</a>
            </li>
            <li>   
                <a href="/apple"> Apple Loging</a>
            </li>
            <li> 
                <a href="/youtube">Youtube Login</a>
            </li>
            <li>
                <a href="/spotify">Spotify Login</a>
            </li>
            <li>
                <a href="/Usrlogin">User Login</a>
            </li>
        </ul>
    </nav>)
}
