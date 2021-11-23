// LIBRARIES

const express = require('express');

const path = require('path');

const mongoose = require('mongoose');

// EXPRESS CONFIG

const app = express();

app.use("/static", express.static(path.join(__dirname, 'static')));

app.use(express.urlencoded({ extended: true }));

// PUG CONFIG

app.set('view engine', 'pug')

app.set('views', path.join(__dirname, 'template'))


// GET REQUESTS

app.get("/", (req, res) => {
    res.status(200).render('index', { title: "death's Gym | Home" });
});

app.get("/about", (req, res) => {
    res.status(200).render('about', { title: "death's Gym | About" });
});

app.get("/pricing", (req, res) => {
    res.status(200).render('pricing', { title: "death's Gym | Pricing" });
});

app.get("/contact", (req, res) => {
    res.status(200).render('contact', { title: "death's Gym | Contacts" });
});


// CONNECTION

const port = 80;

app.listen(port, () => {
    console.log(`The app started success fully on localhost:${port}`);
});

// MONGODB CONFIG

let connectedToMongo = false;

let pendingRequests = [];

connectMongo().catch(err => { console.log(err) })

async function connectMongo() {
    await mongoose.connect('mongodb://localhost:27017/gymMemberReqs');
}

var db = mongoose.connection;
db.on('error', err => {
    console.error.bind('error', (console, 'connetction error: '));
});
db.once('open', () => {
    connectedToMongo = true;
    if (pendingRequests.length != 0) {
        pendingRequests.forEach(element => {
            SaveToMongo(element);
        });
    }
});

// MONGODB STUFF

const memberRequestSchema = mongoose.Schema({
    name: String,
    email: String,
    number: Number,
    address: String
});

const memberRequest = mongoose.model('memberRequests', memberRequestSchema);

function SaveToMongo(data) {
    if (!connectedToMongo) {
        pendingRequests.push(data);
        return;
    }
    data.save()
}

// POST REQUESTS

app.post("/", (req, res) => {
    const data = req.body;

    const newRequest = new memberRequest({
        name: data.name,
        email: data.email,
        number: data.number,
        address: data.address
    });

    SaveToMongo(newRequest);

    res.status(200).redirect('/');
});
