// server.js
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
/*

Firt Google information for YOUTUBE API to do searched and get user informtion of their iteams:
APIKEY: AIzaSyDhDpQvbI2W1P5IH8xV4o2fsw0gK_5lGzY
Client ID: 808121759367-6efs65rh50k4p5qhn6af10iqjtgcs7m8.apps.googleusercontent.com
Client Secret: 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

Second :
API KEY: AIzaSyBnKLIVgOiPTzRVvXMguoHi8a49aVvEUvI
cLIENT ID: 803626348217-cst9ufc52a6hi6llijn1gkm0491hnhq4.apps.googleusercontent.com
Client Secret: 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

API KEY: AIzaSyBWAir5kNDcRDZAAPr8pvINjmJA2ERD22M
Client secret: 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
Client ID: 1005392414752-kmq436j60idb4no59quujm9gic61jr3f.apps.googleusercontent.com
*/
const API_KEY = 'AIzaSyBWAir5kNDcRDZAAPr8pvINjmJA2ERD22M';
const C_secrete = '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';
const C_id = '808121759367-6efs65rh50k4p5qhn6af10iqjtgcs7m8.apps.googleusercontent.com';
const oauthCall = 'http://localhost:3001/oauth2callback';
const oauth2Client = new google.auth.OAuth2(
  C_id, // Replace with client ID
  C_secrete, // Replace with client secret
  'http://localhost:3001/oauth2callback'// <- is for this server don't. server's redirect URI
);
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
const SCOPES = ['https://www.googleapis.com/auth/youtube'];
console.log("Its here");
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authUrl);
});
async function refreshAccessTokenIfNeeded(){
  if(oauth2Client.credentials.expiry_date<Date.now()){
    await oauth2Client.refreshAccessToken();
  }
};
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.redirect('http://localhost:3000?accessToken=' + tokens.access_token);
    //req.session.refreshToken = tokens.refresh_token;
  } catch (err) {
    console.error('Error retrieving access token', err);
    res.status(500).send('Authentication failed');
  }
});

app.get('/youtube/playlists', async (req, res) => {
  //await refreshAccessTokenIfNeeded();
  const accessToken = req.query.accessToken;
  if(!accessToken){
    return res.status(400).send('Access Token Required');
  }
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({access_token: accessToken});
  try {
    
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    const response = await youtube.playlists.list({
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 20,
    });

    res.json(response.data);
  } catch (err) {
    console.error('The API returned an error: ' + err);
    res.status(500).send('Error fetching playlists');
  }
});
app.get('/youtube/playlistItems', async (req, res) => {
  //await refreshAccessTokenIfNeeded();
  const { accessToken, playlistId } = req.query;
  if (!accessToken || !playlistId) {
    return res.status(400).send('Access Token and Playlist ID Required');
  }

  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });

  try {
    const youtube = google.youtube({ version: 'v3', auth: authClient });
    const response = await youtube.playlistItems.list({
      part: 'snippet,contentDetails',
      playlistId: playlistId,
      maxResults: 50 // Adjust as needed
    });

    res.json(response.data);
  } catch (err) {
    console.error('Error fetching playlist items:', err);
    res.status(500).send('Error fetching playlist items');
  }
});

app.post('/youtube/addToPlaylist', async (req, res) => {
  //await refreshAccessTokenIfNeeded();
  const { accessToken, playlistId, videoId } = req.body;
  
  if (!accessToken || !playlistId || !videoId) {
    return res.status(400).send('Access Token, Playlist ID and Video ID Required');
  }

  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });

  try {
    const youtube = google.youtube({ version: 'v3', auth: authClient });
    await youtube.playlistItems.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId: videoId
          }
        }
      }
    });
    res.send('Video added to playlist');
  } catch (err) {
    console.error('Error adding video to playlist:', err);
    res.status(500).send('Error adding video to playlist');
  }
});

/* Meant to creat playlist */
app.post('/youtube/createPlaylists', async (req, res) => {
  const { accessToken, title, description } = req.body;

  if (!accessToken || !title) {
    return res.status(400).send('Access Token and Title Required');
  }

  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });

  try {
    const youtube = google.youtube({ version: 'v3', auth: authClient });
    const response = await youtube.playlists.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: title,
          description: description
        },
        status: {
          privacyStatus: 'public' // or 'private', 'unlisted'
        }
      }
    });
    
    res.json(response.data);
  } catch (err) {
    console.error('Error creating playlist:', err);
    res.status(500).send('Error creating playlist');
  }
});

/** */

app.delete('/youtube/removeFromPlaylist', async (req, res) => {
  //await refreshAccessTokenIfNeeded();
  const { accessToken, playlistItemId } = req.body;

  if (!accessToken || !playlistItemId) {
    return res.status(400).send('Access Token and Playlist Item ID Required');
  }

  const authClient = new google.auth.OAuth2();
  
  authClient.setCredentials({ access_token: accessToken });
  try {
    
    const youtube = google.youtube({ version: 'v3', auth: authClient });
    await youtube.playlistItems.delete({
      id: playlistItemId
    });
    res.send('Video removed from playlist');
  } catch (err) {
    console.error('Error removing video from playlist:', err);
    res.status(500).send('Error removing video from playlist');
  }
});
app.delete('/youtube/deletePlaylist', async (req, res) => {
  //await refreshAccessTokenIfNeeded();
  const { accessToken, playlistId } = req.body;
  if (!accessToken || !playlistId) {
    return res.status(400).send('Access Token and Playlist ID Required');
  }

  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });

  try {
   
    const youtube = google.youtube({ version: 'v3', auth: authClient });
    await youtube.playlists.delete({
      id: playlistId
    });
    res.send('Playlist deleted');
  } catch (err) {
    console.error('Error deleting playlist:', err);
    res.status(500).send('Error deleting playlist');
  }
});




const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});