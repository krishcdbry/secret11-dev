'use strict';

let express = require('express');
let app = express();
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');
let connectMultipart = require('connect-multiparty');
let multipartMiddleware = connectMultipart();

// Controllers
let authController = require('./controllers/auth-controller');
let profileController = require('./controllers/profile-controller');
let storyController = require('./controllers/story-controller');
let tagController = require('./controllers/tag-controller');

// Datasets
let story = require('./models/story.js');
let user = require('./models/users.js');

// Firewall for router
let firewall = require('./helpers/firewall');

// DB connection
mongoose.connect('mongodb://localhost:27017/secret11-dbs');

app.use(bodyParser.json());
app.use(multipartMiddleware);

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
	res.json({"message" : "Welcome to Secret11 API"});
});

// Authentication service
app.post('/auth/signup', authController.signup);
app.post('/auth/login', authController.login);
app.post('/auth/logout', authController.logout);


// User 
app.get('/user', firewall, profileController.me);
app.get('/user/:user', firewall, profileController.getUserProfile);
app.put('/user', firewall, profileController.updateUser);

// Story
app.get('/story/feed', firewall, storyController.feed);
app.post('/story/publish', firewall, storyController.publish);
app.get('/story/reply/:story', firewall, storyController.replyFeed);
app.post('/story/reply', firewall, storyController.addReply);

app.get('/story/userfeed', firewall, storyController.feedByUser);
app.get('/story/userfeed/:user', firewall, storyController.feedByUser);

app.post('/story/vote', firewall, storyController.upVote);
app.delete('/story/vote/:story', firewall, storyController.downVote);

// Tag
app.get('/tag/:name', firewall, tagController.tagData);
app.get('/tag/feed/:tag', firewall, tagController.tagFeed)

// app.post('/api/user/profile-photo', multipartMiddleware, profileController.uploadPhoto);

// app.post('/api/user/profile-video', multipartMiddleware, profileController.uploadVideo);


// Scrap website
//app.post('/api/scrap', scrapController.scrap);

http.listen('9000', function () {
	console.log("Working dude !!");
});