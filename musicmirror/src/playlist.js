//import MongoClient from 'mongodb';
// const uri = "mongodb+srv://carobles:Du1UYVCn02jkYmaD@musicmirrorcluster.ke9uina.mongodb.net/?retryWrites=true&w=majority";

export async function findSongs(input, resCount) {
    console.log(input);
    const token = localStorage.getItem("token");
    //separate each query by line
    let search = input.split('\n');
    //iterate over songs and search for song
    let playlist = {
        title: "Music Mirror Playlist",
        songs: [],
    };
    let url = "";
    for(let i in search){
        //skip over empty lines
        if(search[i] === '') {
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
        let uris = [];
        for (let i in list.songs) {
            uris.push(list.songs[i].tracks[0].uri);
        }

        // Iterate through list of matches and add each song to the playlist (api req)
        resp = await fetch("https://api.spotify.com/v1/playlists/" + p_id + "/tracks", {
            method: "POST",
            body: JSON.stringify({uris}),
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => response.json())
        .then((json) => console.log(json));
    }
}

export async function getPlaylists() {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

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

// export async function savePlaylist(list) {
//     const uri = "mongodb+srv://carobles:Du1UYVCn02jkYmaD@musicmirrorcluster.ke9uina.mongodb.net/?retryWrites=true&w=majority";
//     const client = new MongoClient(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
    
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
  
//     const res = await client.db("users").collection("playlists").insertOne(list);
//   }

export async function savePlaylist(list) {
    //change later to get current user's id
    let uid = "656822bfe9f57013d3b46c2e"

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
        let resp = await fetch("http://localhost:5000/playlist/" + uid, {
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
  }
