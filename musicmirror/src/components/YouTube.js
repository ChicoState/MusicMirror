import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import YoutubeSearch from './YoutubeSearch';
import {Tabs, Tab} from "react-bootstrap";

/*
API_KETYS:

1ST:AIzaSyDhDpQvbI2W1P5IH8xV4o2fsw0gK_5lGzY

2ND:AIzaSyBnKLIVgOiPTzRVvXMguoHi8a49aVvEUvI

CHNAGE whne the API search limit has been reached and request, 
go to the server and change the need info
*/
const API_KEY = 'AIzaSyBnKLIVgOiPTzRVvXMguoHi8a49aVvEUvI';
const MAXRESULTS = 20;

//We are reciving the search term form the text  box 
function Youtube({searchTerm}){
  const [user, setUser] = useState({});//sets user state 
  const [accessToken, setAccessToken] = useState(null);//access token used for the user
  const [playlists, setPlaylists] = useState([]);//Playlist 
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
//START OF EFFECT
  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    //used to be called authCode
    const token = urlParams.get('accessToken');
    console.log("HERE :::::", token);
    const code = urlParams.get('code');
    if(token){
      setAccessToken(token);
      console.log("GOt the fucker", token);
      setAccessToken(token);
      
    }else{
     console.log("Yeaaaah");
    }
    if(code){
      axios.post('http://localhost:3001/getAccessToken', {code: code}).then(response=>{
        setAccessToken(response.data.acessToken);
      }).catch(error=>console.error('Error in fetching acess Token:',error));
    }
    if(accessToken){
      //console.log("We got the toke", accessToken);
      fetchUserPlaylists();
    }

  },[searchTerm,accessToken]);
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

  /*End of userplaylist */
/////////* User playlist eidt */
  /*End of user Edit */

  const renderVideoPlayer = () => {
    console.log("Here at render:::", currentVideoId);
    return currentVideoId && (
      <iframe 
        width="auto"
        height="auto"
        src={`https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen>
      </iframe>
    );
  };
  const handleVideoSelect = (playlistIndex, videoIndex) => {
    setCurrentPlaylistIndex(playlistIndex);
    setCurrentVideoIndex(videoIndex);
    setCurrentVideoId(playlists[playlistIndex].videos[videoIndex].snippet.resourceId.videoId);
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
      <Tab tabClassName="SearchResults" eventKey={"SearchResults"} title="Search Results">
         
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
          {/* Conditional rendering: Show list if no video is selected */}
          {!currentVideoId ? (
          playlists.map((playlist, playlistIndex) => (
            <div key={playlist.id}>
              <h3>{playlist.snippet.title}</h3>
              {playlist.videos.map((video, videoIndex) => (
                <div key={video.id} onClick={() => handleVideoSelect(playlistIndex, videoIndex)}>
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
          ))
        ) : (
          renderVideoPlayer()
        )}
      </div>
      </Tab>
        {/*<button onClick={fetchUserPlaylists}>
            Playlist
        </button>*/}

  </Tabs>
  );
}

export default Youtube;




/*
Oauth:
Client: 808121759367-6efs65rh50k4p5qhn6af10iqjtgcs7m8.apps.googleusercontent.com
secret:  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 <--- Important don't lose

*/