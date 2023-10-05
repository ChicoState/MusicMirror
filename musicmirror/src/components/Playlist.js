import { genPlaylist } from '../playlist';
import '../styles/Playlist.css';
import {getPlaylist} from './AddSongs.js'
import React from 'react';


class Playlist extends React.Component{
  constructor(){
    super();
    this.state = {
      playlist: {},
      //playLen: 0,
    };
  }

  handlePlaylist() {
    const getData = async () => {
      let obj = await getPlaylist();
      let list = JSON.parse(obj);
      this.setState({playlist: list});
    };
    getData();
  }

  render() {
    const { playlist } = this.state;

    if(Object.keys(playlist).length === 0){
      return (
        <div className="Playlist-container mt-5">
        <div className="list-container">
          <h3>Add songs to preview playlist</h3>
        </div>
      </div>
      );
    }
      else if(playlist.songs && Object.keys(playlist.songs).length > 0){
        return (
          <div className="Playlist-container mt-5">
            <div className="list-container">
              <h3>{playlist.title}</h3>
              <ol className="">
                  {playlist.songs.map((song) => (
                    <li className="">{song.title} | {song.artist} | {song.album} | {song.length}</li>
                  ))}
                </ol>
            </div>
            <button className="btn btn-secondary" onClick={() => genPlaylist(playlist)}>Create Playlist</button>
          </div>
        );
      }
      else{
        return null;
      }
  }
}

/*
export function Playlist() {
  const [playlist, setPlaylist] = useState();

    useEffect(() => {
      const getData = async () => {
        let obj = await getPlaylist();
        let list = JSON.parse(obj);
        setPlaylist(list);
      }
      getData();
    }, []);
    console.log("out of getPlaylist");

  if(!playlist){
    return(
      <div className="Playlist-container mt-5">
      <div className="list-container">
        <h3>Add songs to preview playlist</h3>
      </div>
    </div>
    );
  }

  if(Object.keys(playlist.songs).length > 0){
    console.log("in if statement");
    return (
      <div className="Playlist-container mt-5">
        <div className="list-container">
          <h3>{playlist.title}</h3>
          <ol className="">
              {playlist.songs.map((song) => (
                <li className="">{song.title} | {song.artist} | {song.album} | {song.length}</li>
              ))}
            </ol>
        </div>
        <button className="btn btn-secondary" onClick={() => genPlaylist(playlist)}>Create Playlist</button>
      </div>
    );
  }
}
*/
export default Playlist;