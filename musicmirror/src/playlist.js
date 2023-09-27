// import * as auth from './auth';

// const clientId = "950b5e4bacb54dc1ad9c2ce70e2a4d48";
// const params = new URLSearchParams(window.location.search);
// const code = params.get("code");

export async function findSongs(){
    const token = localStorage.getItem("token");
    //separate each query by line
    let songList = "give me everything - pitbull\nsuper shy - newjeans\nI'm god - lil B\nphoton scooter\ndior - pop smoke";
    let songs = songList.split('\n');
    //iterate over songs and search for song
    let uriList = [];
    let url = "";
    let user_id = "";
    for(let i in songs){
        url = "https://api.spotify.com/v1/search/?q=" + songs[i].replace(' ', '+') + "&type=track";
        //search for songs[i]
        let resp = await fetch(url, {
            method: "GET", headers: { Authorization: `Bearer ${token}` }
        });
        let obj = resp.json();
        //if exists, add to playlist
        if(Object.keys(obj.tracks.items).length > 0){
            uriList += obj.tracks.items[0].uri;
        }
    }
    console.log(uriList);
}

export async function genPlaylist(uriList, user_id){
    // if list size > 0, create playlist (api req)
    if(uriList.size > 0){
        //create spotify playlist
        //POST REQ
        let resp = fetch("https://api.spotify.com/v1/users/" + user_id + "/playlists", {
            method: "POST",
            body: JSON.stringify({name: "Music Mirror Playlist"}),
            headers: {Authentication: 'Bearer Token'}
        }).then((response) => response.json())
        .then((json) => console.log(json));

        // Iterate through list of matches and add each song to the playlist (api req)
        resp = fetch("https://api.spotify.com/v1/playlists/" + user_id + "/playlists", {
            method: "POST",
            body: JSON.stringify({name: "Music Mirror Playlist"}),
            headers: {Authentication: 'Bearer Token'}
        }).then((response) => response.json())
        .then((json) => console.log(json));
    }
}