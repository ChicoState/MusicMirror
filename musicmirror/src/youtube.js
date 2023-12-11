import axios from 'axios';

/*******************************************************************************
API_KEYS:

//1ST:
const API_KEY ='AIzaSyDhDpQvbI2W1P5IH8xV4o2fsw0gK_5lGzY';
*//*
//2ND:
const API_KEY='AIzaSyBnKLIVgOiPTzRVvXMguoHi8a49aVvEUvI';
*//*
//3RD:
const API_KEY='AIzaSyBWAir5kNDcRDZAAPr8pvINjmJA2ERD22M';
*//*
4th:*/
const API_KEY = 'AIzaSyAV-JTsRzcn_ZIj32pSkrEGlY1eJHvosv0';
/**//*
Fith:
*//*
CHANGE when the API search limit has been reached and request, 
go to the server and change the needed info
*******************************************************************************/

const MAXRESULTS = 5; //Used to limit the amout of search output to show


//------------------------------------------------------------------------------

// url is not "safe" if it may contain auth credentials from another service (Spotify)
export async function signIn(urlSafe) {

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('accessToken');
  const code = urlParams.get('code');
  const selectedVideoId = [];

  if (urlSafe && token) {
    sessionStorage.setItem('youtubeAccessToken',token);
    sessionStorage.setItem('loggedInYT','true');
  } else if (urlSafe && code) {
    axios.post('http://localhost:3001/getAccessToken',{code: code}).then(response=>{
      sessionStorage.setItem('youtubeAccessToken',response.data.accessToken);
      sessionStorage.setItem('loggedInYT','true');
    }
    ).catch(error=>console.error('Error in fetching acess Token:',error));
  } else {
    window.location.href = 'http://localhost:3001/auth/google';
  }
};

//------------------------------------------------------------------------------

export async function signOut() {

  sessionStorage.removeItem('youtubeAccessToken');
  sessionStorage.setItem('loggedInYT', 'false');
};

//------------------------------------------------------------------------------

export async function fetchUserPlaylists() {

  if (sessionStorage.getItem('loggedInYT') !== 'true') {
    return null;
  }
  try {
    const playlistsResponse = await axios.get('http://localhost:3001/youtube/playlists', {
      params: { accessToken: sessionStorage.getItem('youtubeAccessToken') }
    });

    const playlistsWithVideos = await Promise.all(
      playlistsResponse.data.items.map(async (playlist) => {
        const videosResponse = await axios.get(`http://localhost:3001/youtube/playlistItems`, {
          params: { 
            accessToken: sessionStorage.getItem('youtubeAccessToken'), 
            playlistId: playlist.id 
          }
        });
        return { ...playlist, videos: videosResponse.data.items };
      })
    );

    return(playlistsWithVideos);

  } catch (error) {
    console.error('Error fetching playlists:', error);
    return null;
  }
};

//------------------------------------------------------------------------------
/**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
export async function performYouTubeSearch(searchInput, numResults) {

  let searchTerms = searchInput.split(/[\n,]\s*/);
  let newSongs = [];
  let newList = {
    title: "Music Mirror Playlist", 
    songs: []
  };

  for (const term of searchTerms) {
    try {
      const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: MAXRESULTS, //amount of searches that will be displayed
          key: API_KEY, //this isn't truly needed but is good to have
          q: term,
          type: 'video',
          videoCategoryId: '10',
        },
      });

      const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');
      const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,contentDetails',
          id: videoIds,
          key: API_KEY,
        },
      });

      const detailedItems = searchResponse.data.items.map(item => {
        const detail = detailsResponse.data.items.find(d => d.id === item.id.videoId) ?? {};
        return {
          ...item,
          id: item.id,
          title: item.snippet.title,
          thumbnails: item.snippet.thumbnails,
          duration: detail.contentDetails?.duration,
          channelTitle: item.snippet.channelTitle,
          artist: item.snippet.channelTitle, // channel title used as artist for song cards
          publishedAt: item.snippet.publishedAt,
          definition: detail.contentDetails?.definition,
        };
      });

      newSongs.push({ query: term, tracks: detailedItems.slice(0, numResults) });

    } catch (error) {
      console.error("Error in multi search for term:", term, "Error:", error);
    }
  }

  newList.songs = newSongs;
  console.log("---INSIDE YOUTUBE SEARCH FUNC---");
  console.log(newList);
  return(newList);
};
/**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
/**+++++++++++++++++++++++++++++++++++++++CREATE PLAYLIST STARTS+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
export async function createPlaylist(title, description) {
  const accessToken = sessionStorage.getItem('youtubeAccessToken');
  if (!accessToken) {
    console.error('An issue with the token:', accessToken);
    return;
  }
  if (!title) {
    console.log('No title given');
    return;
  }
  else{
    title = "MusicMirror Playlis";
  }
  try {
    const response = await axios.post('http://localhost:3001/youtube/createPlaylists',{     
       accessToken //This is also needed, since we need to have permision to edit said user YT
      ,title//This is required to name the playlist
      ,description//this not so much, can be left blank
    }
    );
    console.log('Playlist created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in creating playlist:', error);
  }
}
/*This function is called upon thee PlaylistCreationYT.js, there we have the form and getting the user input
as well we get the accessToken, we can change that as well to be ony in here.*/
/**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
/**+++++++++++++++++++++++++++++++++++++++++++Add Songs To Playlist++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

export async function addSongToPlaylist(playlistId, videoId, accessToken) {
  if (!playlistId || !videoId || !accessToken) {
    console.error('Playlist ID, video ID, and access token are required');
    return;
  }

  try {
    const response = await axios.post('https://www.googleapis.com/youtube/v3/playlistItems', {
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

    console.log('Song added to playlist:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in adding song to playlist:', error);
    throw error;
  }
}

/**+++++++++++++++++++++++++++++++++++++++++++++++++++FISH++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/