import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import YoutubeSearch from './YoutubeSearch';
import {Tabs, Tab} from "react-bootstrap";

/*
API_KETYS:

1ST:AIzaSyDhDpQvbI2W1P5IH8xV4o2fsw0gK_5lGzY

2ND:AIzaSyBnKLIVgOiPTzRVvXMguoHi8a49aVvEUvI

3RD: AIzaSyBWAir5kNDcRDZAAPr8pvINjmJA2ERD22M

CHNAGE whne the API search limit has been reached and request, 
go to the server and change the need info
*/
const API_KEY = 'AIzaSyDhDpQvbI2W1P5IH8xV4o2fsw0gK_5lGzY';
const MAXRESULTS = 20;

//We are reciving the search term form the text  box 
function Youtube({searchTerm, Loged}){
  const [user, setUser] = useState({});//sets user state 
  const [accessToken, setAccessToken] = useState(null);//access token used for the user
  const [playlists, setPlaylists] = useState([]);//Playlist 
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  console.log('The Search: val', searchTerm);
//START OF EFFECT
  useEffect(()=>{
    let storedToken = localStorage.getItem('youtubeToken');//use to store the token
    const urlParams = new URLSearchParams(window.location.search);//url parameters
    //used to be called authCode
    const token = urlParams.get('accessToken');
    const code = urlParams.get('code');
    if(token){
      setAccessToken(token);
      localStorage.setItem('youtubeAccessToken',token);
    }else if(code){
      axios.post('http://localhost:3001/getAccessToken',{code: code}).then(response=>{
        setAccessToken(response.data.acessToken);
        localStorage.setItem('youtubeAccessToken',accessToken);
      }
      ).catch(error=>console.error('Error in fetching acess Token:',error));
    }else if(storedToken){
      setAccessToken(storedToken);
      fetchUserPlaylists(storedToken);
    }
    if(accessToken){
      fetchUserPlaylists();
    }

  },[searchTerm, accessToken, Loged]);
  
  const signIn =()=> {
    window.location.href = 'http://localhost:3001/auth/google';
  };
  const createPlaylist = async (accessToken, playlistTitle, playlistDescription) => {
    const response = await axios.post('https://www.googleapis.com/youtube/v3/playlists', {
      snippet: {
        title: playlistTitle,
        description: playlistDescription
      },
      status: {
        privacyStatus: 'public' // or 'public' or 'unlisted'
      }
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  
    return response.data; // This will include the newly created playlist ID
  };
  const addVideoToPlaylist = async (accessToken, playlistId, videoId) => {
    await axios.post('https://www.googleapis.com/youtube/v3/playlistItems', {
      snippet: {
        playlistId: playlistId,
        resourceId: {
          kind: 'youtube#video',
          videoId: videoId
        }
      }
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  };
    

  const signOut =()=>{
    setUser(null);
    setPlaylists([]);
    localStorage.removeItem('youtubeAccessToken');
    setAccessToken(null);
  };
  useEffect(() => {
    if (window.YT && currentVideoId) {
      initializePlayer();
    }
  }, [currentVideoId]);

  const fetchUserPlaylists = async () => {
    if (!accessToken) {
      return;
    }
    try {
      const playlistsResponse = await axios.get('http://localhost:3001/youtube/playlists', {
        params: { accessToken: accessToken }
      });

      const playlistsWithVideos = await Promise.all(
        playlistsResponse.data.items.map(async (playlist) => {
          const videosResponse = await axios.get(`http://localhost:3001/youtube/playlistItems`, {
            params: { accessToken: accessToken, playlistId: playlist.id }
          });
          return { ...playlist, videos: videosResponse.data.items };
        })
      );

      setPlaylists(playlistsWithVideos); // Use the combined playlists and videos data
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleVideoSelect = (playlistIndex, videoIndex) => {
    setCurrentPlaylistIndex(playlistIndex);
    setCurrentVideoIndex(videoIndex);
    setCurrentVideoId(playlists[playlistIndex].videos[videoIndex].snippet.resourceId.videoId);
};
const renderVideoPlayer = () => {
  return (
    <div>
      {currentVideoId && (
        <iframe 
          width="auto"
          height="auto"
          src={`https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
        </iframe>
      )}
      {/* Render the current playlist below the video */}
      {playlists.length > 0 && currentPlaylistIndex !== null && (
        <div>
          <h3>{playlists[currentPlaylistIndex].snippet.title}</h3>
          {playlists[currentPlaylistIndex].videos.map((video, videoIndex) => (
            <div key={video.id} onClick={() => handleVideoSelect(currentPlaylistIndex, videoIndex)}>
              <img
                height="200"
                width="250"
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
              />
              <p>{video.snippet.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


    // Function that initializes the YouTube player
    const initializePlayer = () => {
      return new window.YT.Player('youtube-player', {
        videoId: currentVideoId,
        events: {
          'onStateChange': onPlayerStateChange
        },
        playerVars: {
          autoplay: 1, // Auto-play the video on load
          controls: 1, // Show pause/play buttons in player
          enablejsapi: 1, // Enable the JavaScript API
          modestbranding: 1, // Hide the Youtube Logo
          rel: 0, //  Don’t show related videos
          showinfo: 0, // Hide the video title
          iv_load_policy: 3, // Hide the Video Annotations
        },
      });
    };
  
    const onPlayerStateChange = (event) => {
      console.log("Here on state change",event);
      if (event.data === window.YT.PlayerState.ENDED && currentPlaylistIndex !== null) {
        let nextIndex = (currentVideoIndex + 1) % playlists[currentPlaylistIndex].videos.length;
        setCurrentVideoIndex(nextIndex);
        setCurrentVideoId(playlists[currentPlaylistIndex].videos[nextIndex].snippet.resourceId.videoId);
      }
    };
    

  // After the current video ID is updated, load the new video into the player
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initializePlayer();
    }
  }, [currentVideoId]);
  
  return(
    <Tabs>
     <Tab tabClassName='Signing'eventKey={"Singing"} title="Signing/Signout" >
        { !user &&(
            <button onClick={signIn}>Sign In with Google</button>
          )
          
        }
        { user &&(
          <div>
            <img src ={user.picture} alt={user.name} width ="18" height="18"/>
            <h6>{user.name}</h6>
            <button onClick={signOut}>Sign Out</button>
          </div>
        )

        }
      </Tab>
      <Tab tabClassName="SearchResults" eventKey={"SearchResults"} title="Search Results" >
        {searchTerm && (
            <YoutubeSearch
              searchTearm={searchTerm}
              API_KEY={API_KEY} 
              MAXRESULTS={MAXRESULTS}
              accessToken={accessToken}
              playlists={playlists}
            />
          
        )}

      </Tab>
      
      <Tab tabClassName='Playlist' eventKey={"Playlist" }title="Playlist">
      <div>
          {renderVideoPlayer()}
      </div>
      </Tab>
        {/*<button onClick={fetchUserPlaylists}>
            Playlist
        </button>*/}

  </Tabs>
  );
}

export default Youtube;