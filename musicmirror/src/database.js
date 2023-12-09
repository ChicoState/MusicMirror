//Checks user lists in db if that email exists. If it does, return true, else false
//The console will also log that there doesn't exist a user with that email.
export async function emailCheck(email) {

    try {
        let resp = await fetch(`http://localhost:5000/user?email=${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (resp.ok) {
            let jsonData = await resp.json();
            console.log(jsonData);
            
            if(jsonData.email){
                console.log("Current email is: ", jsonData.email);
                return true;
            }
        } else {
            console.error(`Error: ${resp.status} - ${resp.statusText}`);
            return false;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

//Register user with given username, password and email
//I'm assuming the checkEmail() will be used before registering a user to ensure
//no duplicates since usernames and passwords can match. 
export async function createUser(username, password, email){
    const userData = {
        name: username,
        password: password,
        email: email,
    };

    try{
        let resp = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData)
        });
        if(resp.ok){
            const result = await resp.json();
            console.log("user added successfully", result);
            return result;
        } else {
            console.error(`Error: ${resp.status} - ${resp.statusText}`);
        }
    } catch(err) {
        console.error(err);
        throw err;
    }
}

//Returns username if there is one. If there isn't getUsername() will return
//undefined for the username. That's if the email doesn't exist or password is incorrect.
export async function getUsername(email, password){

    try {
        let resp = await fetch(`http://localhost:5000/user?email=${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (resp.ok) {
            let jsonData = await resp.json();
            //console.log(jsonData);
            
            if(jsonData.password === password){
                console.log("Current username is: ", jsonData.name);
                return jsonData.name;
            }
        } else {
            console.error(`Error: ${resp.status} - ${resp.statusText}`);
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

//Returns a list of playlist objects if a user matches id
//Otherwise, returns undefined
export async function getMMPlaylists(id){
    try {
        let resp = await fetch(`http://localhost:5000/user?_id=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (resp.ok) {
            let jsonData = await resp.json();
            
            if(jsonData.playlists.length === 0){
                return undefined;
            } else {
                return jsonData.playlists;
            }
        } else {
            console.error(`Error: ${resp.status} - ${resp.statusText}`);
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

//Deletes user via given email
export async function deleteUser(email){
    try {
        let resp = await fetch(`http://localhost:5000/user/${email}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (resp.ok) {
            const deletedUserData = await resp.json();
            console.log('User deleted successfully:', deletedUserData);
        } else if (resp.status === 404) {
            console.error('User not found');
        } else {
            console.error(`Error: ${resp.status} - ${resp.statusText}`);
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}
