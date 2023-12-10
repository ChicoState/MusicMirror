
export async function findSongs(input, resCount) {
    console.log(input);
    const token = sessionStorage.getItem("token");
    //separate each query by line
    let search = input.split('\n');
    //iterate over songs and search for song
    let playlist = {
        title: "MusicMirror Playlist",
        songs: [],
    };
    let url = "";
    for(let i in search){
        //skip over empty lines
        if(search[i].trim() === '') {
            continue;
        }
        url = "https://api.spotify.com/v1/search/?q=" + search[i].replace(' ', '+') + "&type=track";
        //search for search[i]
        let resp = await fetch(url, {
            method: "GET", headers: { Authorization: `Bearer ${token}` }
        });
        let obj = await resp.json();
        //if exists, add to playlist
        let results = {
            query: "",
            tracks: [],
        }

        let res = 0;
        // added obj.tracks check to prevent "reading props of undefined" runtime error
        while(res < resCount && obj.tracks && res < Object.keys(obj.tracks.items).length) {
            let names = "";
            for(let j in obj.tracks.items[res].artists){
                names += obj.tracks.items[res].artists[j].name + ", ";
            }
            names = names.substring(0, names.length - 2)

            let time = new Date(obj.tracks.items[res].duration_ms);
            let track = {
                title: obj.tracks.items[res].name,
                artist: names,
                album: obj.tracks.items[res].album.name,
                length: `${time.getMinutes()}:${time.getSeconds()}`,
                uri: obj.tracks.items[res].uri,
            };
            results.tracks.push(track);
            console.log(track);
            res++;
        }
        results.query = search[i];
        playlist.songs.push(results);
    }
    console.log(playlist);
    return playlist;
}

export async function genPlaylist(list) {
    console.log(list);
    const user_id = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");
    let uris = [];
    // if list size > 0, create playlist (api req)
    if(Object.keys(list.songs).length > 0){
        try {
            //create spotify playlist
            let resp = await fetch("https://api.spotify.com/v1/users/" + user_id + "/playlists", {
                method: "POST",
                body: JSON.stringify({ name: list.title }),
                headers: { Authorization: `Bearer ${token}` }
            });
            let obj = await resp.json();
            let p_id = obj.id;
            for (let i in list.songs) {
                uris.push(list.songs[i].tracks[0].uri);
            }
            // Iterate through list of matches and add each song to the playlist (api req)
            resp = await fetch("https://api.spotify.com/v1/playlists/" + p_id + "/tracks", {
                method: "POST",
                body: JSON.stringify({ uris }),
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => response.json())
                .then((json) => console.log(json));
            return uris;
        } catch (err) {
            throw err;
        }
    }
    return undefined; //Mostly for testing purposes
}

export async function getPlaylists() {
    const user_id = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");

    let resp = await fetch("https://api.spotify.com/v1/users/" + user_id + "/playlists", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    let obj = await resp.json();

    console.log(obj);
    return obj;
}

export async function searchPlaylists(query) {
    const token = localStorage.getItem("token");

    let url = "https://api.spotify.com/v1/search/?q=" + query.replace(' ', '+') + "&type=playlist";
    let resp = await fetch(url, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await resp.json();
}

export async function savePlaylist(list, uid) {
    if (!list || JSON.stringify(list) === '{}' || list.songs.length <= 0) {
        return undefined;
    }

    let q_body = {
        playlist: {
            p_name: list.title,
            songs: []
        }
    }
    for (let i in list.songs) {
        q_body.playlist.songs.push({
            title: list.songs[i].tracks[0].title,
            artist: list.songs[i].tracks[0].artist
        });
    }
    console.log(q_body);

    try {
        // let resp = await fetch("http://localhost:3002/playlist/" + uid, {
        await fetch("http://localhost:3002/playlist/" + uid, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(q_body),
        });
    } catch (err) {
        console.error(err);
        throw err;
    }

    return q_body;
  }
