const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require("cors");
const uri = "mongodb+srv://carobles:Du1UYVCn02jkYmaD@musicmirrorcluster.ke9uina.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri);

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    playlists: [{
        p_name: String,
        songs: [{
            title: String,
            artist: String
        }]
    }],
});
const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(cors());
console.log("app listening at port 5000");

//healtheck endpoint
app.get("/", (req, res) => {
    try {
        res.send("App is working");
    } catch (err) {
        console.log(`Error: ${err}`);
    }
});

//get user via filters in query string params
app.get("/user", async (req, res) => {
    try {
        const query = User.findOne(req.query);
        let result = await query.exec();
        //result = result.toObject();
        if (result) {
            result = result.toObject();
            res.send(result);
        } else {
            // No user found
            res.status(404).send({ error: "User not found" });
        }
    } catch (err) {
        console.log(`Error: ${err}`);
    }
});

//post user to db
app.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            delete result.password;
            res.send(req.body);
        } else {
            console.log("User already registered.");
        }
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

//delete user from db via user email
app.delete("/user/:email", async (req, res) => {
    const userEmail = req.params.email;
    try {
        const deletedUser = await User.findOneAndDelete({ email: userEmail });

        if (deletedUser) {
            res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

//post playlist to user via user id
app.post("/playlist/:id", async (req, res) => {
    try {
        let query = await User.findByIdAndUpdate(
            req.params.id,
            { $push: { playlists: req.body.playlist } }
        );
        
        res.send(query);
    } catch (err) {
        console.error(`Error: ${err}`);
    }
});
app.listen(5000);
