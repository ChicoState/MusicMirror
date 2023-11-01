const clientId = "950b5e4bacb54dc1ad9c2ce70e2a4d48";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let hasCode = false;

export async function checkCode(){
    console.log("Ran checkCode");
    if (!code) {
        redirectToAuthCodeFlow(clientId);
        console.log("After everything code: " + code);
        hasCode = true;
        // console.log("if: " + code);
    /*} else {
        // console.log("above");
        // console.log(code);
        const accessToken = await getAccessToken(clientId, code);
        localStorage.setItem("token", accessToken);
        // console.log("we out");
        const profile = await fetchProfile(accessToken);
        populateUI(profile);
        hasCode = true;
        */
    }
};

export async function signIn(loggedIn){
    console.log("code at signIn:" + code);
    if(code){
        console.log("In logged in");
        const accessToken = await getAccessToken(clientId, code);
        localStorage.setItem("token", accessToken);
        // console.log("we out");
        const profile = await fetchProfile(accessToken);
        populateUI(profile);
        console.log("PopulatedUI");
        hasCode = true;
    }
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    
    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:3000");
    params.append("scope", "user-read-private user-read-email playlist-modify-public playlist-modify-private");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    
}

export function generateCodeVerifier(length) {
    console.log("generateCode");
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return text;
}

export async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000");
    params.append("code_verifier", verifier);

    console.log("Get access token: " + code);
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

export async function fetchProfile(token) {
    console.log("token: " + token);
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    let res = await result.json();
    localStorage.setItem("user_id", res.id);
    return res;
}

export function populateUI(profile) {
    console.log(profile);
    /*
    document.getElementById("displayName").innerText = profile.display_name;
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    */
}

export function signOut(){
    let newUrl = window.location.href;
    //https://accounts.spotify.com/en/logout <- this will actually sign them out of Spotify
    //We'll save that for when we actually have a login.
    newUrl = newUrl.split("?")[0];
    window.location.href = newUrl;
    localStorage.clear();
}