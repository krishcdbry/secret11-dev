'use strict';

let express = require('express');
let app = express();
let mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let fs = require('fs');
// let privateKey  = fs.readFileSync('../sslconf/api_secret11_com.key', 'utf8');
// let certificate = fs.readFileSync('../sslconf/api_secret11_com.crt', 'utf8');
// let bundle = fs.readFileSync('../sslconf/api_secret11_com.ca-bundle', 'utf8');
// let credentials = {key: privateKey, cert: certificate};

let http = require('http').Server(app);
//let https = require('https').Server(credentials, app);
let io = require('socket.io')(http);
let path = require('path');
let connectMultipart = require('connect-multiparty');
let multipartMiddleware = connectMultipart();
let config = require('./config/secret');


// Controllers
let authController = require('./controllers/auth-controller');
let userController = require('./controllers/user-controller');
let profileController = require('./controllers/profile-controller');
let storyController = require('./controllers/story-controller');
let tagController = require('./controllers/tag-controller');
let searchController = require('./controllers/search-controller');
let topicController = require('./controllers/topic-controller');

// Firewall for router
let firewall = require('./helpers/firewall');

let DB_NAME = "secret11-dbs";
let PORT = 9000;

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

    // Check db
    if (req.headers.hasOwnProperty('host')) {
        if (req.headers['host'].indexOf('geek') > -1) {
            // DB connection
            DB_NAME = "secret11-geek-dbs";
            PORT = "5000";
        }
    }
    
    // DB Connection
    mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`);

    // Pass to next layer of middleware
    next();
});


app.get('/', function (req, res) {
	res.json({"message" : "Welcome to Secret11 dev API"});
});

// Authentication service
app.post('/auth/signup', authController.signup);
app.post('/auth/login', authController.login);
app.post('/auth/logout', authController.logout);


// User 
app.get('/user', firewall, profileController.me);
app.get('/user/:user', firewall, profileController.getUserProfile);
app.put('/user', firewall, profileController.updateUser);

// User Follower
app.post('/user/follow', firewall, userController.followUser);
app.delete('/user/follow/:user', firewall, userController.unfollowUser);

// User Follower
app.get('/topic', firewall, topicController.topics);


// Story
app.get('/story/feed', firewall, storyController.feed);
app.get('/story/feed/:topic', storyController.feedByTopic);
app.post('/story/publish', firewall, storyController.publish);
app.get('/story/reply/:story', firewall, storyController.replyFeed);
app.post('/story/reply', firewall, storyController.addReply);

app.get('/story/userfeed', firewall, storyController.feedByUser);
app.get('/story/userfeed/:user', firewall, storyController.feedByUser);

app.post('/story/vote', firewall, storyController.upVote);
app.delete('/story/vote/:story', firewall, storyController.downVote);

app.post('/story/item', firewall, storyController.storyItem);

// Tag
app.get('/tag/:name', firewall, tagController.tagData);
app.get('/tag/feed/:tag', firewall, tagController.tagFeed);
app.get('/tag-list', firewall, tagController.getTags);

// TagFollow
app.post('/tag/follow', firewall, tagController.followTag);
app.delete('/tag/follow/:tag', firewall, tagController.unfollowTag);

// Search
app.get('/search/global/:key', firewall, searchController.searchGlobal);
app.get('/search/pic/:key', firewall, searchController.searchPic);


// app.post('/api/user/profile-photo', multipartMiddleware, profileController.uploadPhoto);

// app.post('/api/user/profile-video', multipartMiddleware, profileController.uploadVideo);


// Scrap website
//app.post('/api/scrap', scrapController.scrap);

http.listen(PORT, function () {
	console.log("Working dude !!");
});

// https.listen('7200', function () {
// 	console.log("Working dude !!");
// });


module.exports = app;
