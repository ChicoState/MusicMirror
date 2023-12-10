import axios from 'axios';

/*******************************************************************************
API_KEYS:

1ST:AIzaSyDhDpQvbI2W1P5IH8xV4o2fsw0gK_5lGzY

2ND:AIzaSyBnKLIVgOiPTzRVvXMguoHi8a49aVvEUvI

3RD: AIzaSyBWAir5kNDcRDZAAPr8pvINjmJA2ERD22M

CHANGE when the API search limit has been reached and request, 
go to the server and change the needed info
*******************************************************************************/
const API_KEY = 'AIzaSyDhDpQvbI2W1P5IH8xV4o2fsw0gK_5lGzY';
const MAXRESULTS = 20;


//------------------------------------------------------------------------------

// url is not "safe" if it may contain auth credentials from another service (Spotify)
export async function signIn(urlSafe) {

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('accessToken');
  const code = urlParams.get('code');

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

export async function performYouTubeSearch(searchInput, numResults) {

  let searchTerms = searchInput.split('\n');
  let newSongs = [];
  let newList = {
    title: "Music Mirror Playlist", 
    songs: []
  };

  for (const term of searchTerms) {
    // skip over empty lines
    if(term.trim() === '') {
      continue;
    }
    try {
      const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: MAXRESULTS,
          key: API_KEY,
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

//------------------------------------------------------------------------------

