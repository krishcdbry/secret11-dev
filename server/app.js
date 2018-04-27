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
var authController = require('./server/controllers/auth-controller');
var profileController = require('./server/controllers/profile-controller');
var storyController = require('./server/controller/story-controller');

// Datasets
var story = require('./server/datasets/story.js');
var user = require('./server/datasets/users.js');

// DB connection
mongoose.connect('mongodb://localhost:27017/node-krish');

app.use(bodyParser.json());
app.use(multipartMiddleware);
app.use('/assets', express.static(__dirname+ "/assets"));
app.use('/node_modules', express.static(__dirname+ "/node_modules"));
app.use('/views', express.static(__dirname+ "/views"));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Authentication service
app.post('/api/user/signup', authController.signup);

app.post('/api/user/login', authController.login);

app.post('/api/user/profile-photo', multipartMiddleware, profileController.uploadPhoto);

app.post('/api/user/profile-video', multipartMiddleware, profileController.uploadVideo);


// Chat service
app.get('/api/chat/get-chat', chatController.getChat);

app.post('/api/chat/get-chat', chatController.getChat);

app.post('/api/chat/post-chat-pic', multipartMiddleware, chatController.picChat);

app.post('/api/chat/post-chat-video', multipartMiddleware, chatController.videoChat);


// User service
app.get('/api/user/get-users', profileController.getUsers);


// Scrap website
app.post('/api/scrap', scrapController.scrap);

http.listen('9000', function () {
	console.log("Working dude !!");
});