export async function findSongs(input){
    console.log(input);
    const token = localStorage.getItem("token");
    //separate each query by line
    let songs = input.split('\n');
    //iterate over songs and search for song
    // let uriList = [];
    let playlist = {
        title: "Music Mirror Playlist",
        songs: [],
        uris: []
    };
    let url = "";
    for(let i in songs){
        /*
        const query = songs[i].trim();
        if(query == ""){
            continue;
        }
        */
        url = "https://api.spotify.com/v1/search/?q=" + songs[i].replace(' ', '+') + "&type=track";
        //search for songs[i]
        let resp = await fetch(url, {
            method: "GET", headers: { Authorization: `Bearer ${token}` }
        });
        let obj = await resp.json();
        //if exists, add to playlist
        if(Object.keys(obj.tracks.items).length > 0){
            playlist.uris.push(obj.tracks.items[0].uri);
            let names = "";
            for(let i in obj.tracks.items[0].artists){
                names += obj.tracks.items[0].artists[i].name;
                //prevent trailing comma
                if(i === Object.keys(obj.tracks.items[0].artists).length - 1){
                    names += ', ';
                }
            }
            let time = new Date(obj.tracks.items[0].duration_ms);
            //console.log(`duration: ${duration}`);
            let song = {
                title: obj.tracks.items[0].name,
                artist: names,
                album: obj.tracks.items[0].album.name,
                length: `${time.getMinutes()}:${time.getSeconds()}`
            };
            playlist.songs.push(song);
        }
    }
    console.log(playlist);
    return playlist;
    //genPlaylist(uriList);
}

export async function genPlaylist(list){
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    // if list size > 0, create playlist (api req)
    if(Object.keys(list.songs).length > 0){
        //create spotify playlist
        let resp = await fetch("https://api.spotify.com/v1/users/" + user_id + "/playlists", {
            method: "POST",
            body: JSON.stringify({name: list.title}),
            headers: { Authorization: `Bearer ${token}` }
        });
        let obj = await resp.json();
        let p_id = obj.id;

        // Iterate through list of matches and add each song to the playlist (api req)
        resp = await fetch("https://api.spotify.com/v1/playlists/" + p_id + "/tracks", {
            method: "POST",
            body: JSON.stringify({uris: list.uris}),
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => response.json())
        .then((json) => console.log(json));
    }
}