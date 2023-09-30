export async function findSongs(input){
    console.log(input);
    const token = localStorage.getItem("token");
    //separate each query by line
    let songs = input.split('\n');
    //iterate over songs and search for song
    let uriList = [];
    let url = "";
    for(let i in songs){
        url = "https://api.spotify.com/v1/search/?q=" + songs[i].replace(' ', '+') + "&type=track";
        //search for songs[i]
        let resp = await fetch(url, {
            method: "GET", headers: { Authorization: `Bearer ${token}` }
        });
        let obj = await resp.json();
        //if exists, add to playlist
        if(Object.keys(obj.tracks.items).length > 0){
            uriList.push(obj.tracks.items[0].uri);
        }
    }
    genPlaylist(uriList, token);
}

export async function genPlaylist(uriList, token){
    const user_id = localStorage.getItem("user_id");
    // if list size > 0, create playlist (api req)
    if(uriList.length > 0){
        //create spotify playlist
        let resp = await fetch("https://api.spotify.com/v1/users/" + user_id + "/playlists", {
            method: "POST",
            body: JSON.stringify({name: "Music Mirror Playlist"}),
            headers: { Authorization: `Bearer ${token}` }
        });
        let obj = await resp.json();
        let p_id = obj.id;
        // Iterate through list of matches and add each song to the playlist (api req)
        resp = await fetch("https://api.spotify.com/v1/playlists/" + p_id + "/tracks", {
            method: "POST",
            body: JSON.stringify({uris: uriList}),
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => response.json())
        .then((json) => console.log(json));
    }
}