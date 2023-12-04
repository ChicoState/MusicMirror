import { getPlaylists } from "./playlist";

const clientId = "950b5e4bacb54dc1ad9c2ce70e2a4d48";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let hasCode = false;
let isTokenExchangeInProgress = false;

export async function checkCode(){
    console.log("Ran checkCode");
    if (!code) {
        await redirectToAuthCodeFlow(clientId);
        console.log("After redirectToAuthCodeFlow, code: " + code);
        hasCode = true;
    }
};

export async function signIn(loggedIn){
    console.log("code at signIn:" + code);
    //const bingo = params.get("code");
    //console.log("bingo: ", bingo);
    if(code && !localStorage.getItem("accessToken")){

        const verifier = localStorage.getItem("verifier");
        console.log("verifier before token request:", verifier);

        const accessToken = await getAccessToken(clientId, code);

        if(accessToken && accessToken !== "undefined"){
            const profile = await fetchProfile(accessToken);
            populateUI(profile);
        }
        hasCode = true;

        getPlaylists();
    }
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    
    if(!localStorage.getItem("verifier")){
        localStorage.setItem("verifier", verifier);
    }

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
/*
export async function getAccessToken(clientId, code) {
    console.log("access token here: ", localStorage.getItem("accessToken"));
    if(localStorage.getItem("accessToken")){
        console.log("HERE");
        return localStorage.getItem("accessToken");
    }
    
    const verifier = localStorage.getItem("verifier");

    console.log("verifier before token request: ", verifier);

    console.log("Code before token request:", code);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000");
    params.append("code_verifier", verifier);

    //console.log("Token request parameters:", params.toString());

    //console.log("Code for access token: " + code);
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    console.log("Token request result:", result);

    if (!result.ok) {
        const errorData = await result.json();
        console.error("Token request error:", errorData);
        // Handle the error case appropriately in your code
        return null; // or throw an error
    }

    const { access_token } = await result.json();
    console.log("immediate at: ", access_token);

    if(!localStorage.getItem("accessToken")){

        localStorage.setItem("accessToken", access_token);
    }
    
    return access_token;
}
*/
export async function getAccessToken(clientId, code) {
    // Check if token exchange is already in progress
    if (isTokenExchangeInProgress) {
        console.log("Token exchange is already in progress. Ignoring this call.");
        return null;
    }

    // Set the flag to indicate that token exchange is in progress
    isTokenExchangeInProgress = true;

    try {
        const verifier = localStorage.getItem("verifier");

        console.log("verifier before token request: ", verifier);
        console.log("Code before token request:", code);

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", "http://localhost:3000");
        params.append("code_verifier", verifier);

        console.log("Token request parameters:", params.toString());

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        console.log("Token request result:", result);

        if (!result.ok) {
            const errorData = await result.json();
            console.error("Token request error:", errorData);
            // Handle the error case appropriately in your code
            return null; // or throw an error
        }

        const { access_token } = await result.json();
        console.log("Access token:", access_token);

        localStorage.setItem("token", access_token);

        return access_token;
    } finally {
        // Reset the flag when the token exchange is complete
        isTokenExchangeInProgress = false;
    }
}

export async function fetchProfile(token) {
    //console.log("token: " + token);
    
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    let res = await result.json();
    console.log("Before user_id" + res.id);
    if(!localStorage.getItem("user_id")){
        localStorage.setItem("user_id", res.id);
        console.log("user_id" + res.id);
    }
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