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

export async function signIn() {

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('accessToken');
  const code = urlParams.get('code');

  if (token && sessionStorage.getItem('loggedIn') === 'false') {
    sessionStorage.setItem('youtubeAccessToken',token);
    sessionStorage.setItem('loggedInYT','true');
  } else if (code && sessionStorage.getItem('loggedIn') === 'false') {
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

