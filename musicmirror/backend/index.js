const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require("cors");
const uri = "mongodb+srv://carobles:Du1UYVCn02jkYmaD@musicmirrorcluster.ke9uina.mongodb.net/?retryWrites=true&w=majority";
const querystring = require('querystring');
const url = require('url');

mongoose.connect(uri);

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    playlists: [String],
});
const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(cors());
console.log("app listening at port 5000");

app.get("/healthcheck", (req, res) => {
    try {
        res.send("App is working");
    } catch (err) {
        console.log(`Error: ${err}`);
    }
});

app.get("/user", async (req, res) => {
    try {
        const query = User.findOne(req.query);
        let result = await query.exec();
        result = result.toObject();
        if (result) {
            res.send(result);
        }
    } catch (err) {
        console.log(`Error: ${err}`);
    }
});

app.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            delete result.password;
            res.send(req.body);
            console.log(result);
        } else {
            console.log("User already registered.");
        }
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

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
