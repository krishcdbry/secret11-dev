const User = require('../models/users');
const Story = require('../models/story');
const Reply = require('../models/reply');
const Follower = require('../models/follower');

const Smart = require('../helpers/smart');


const UserController = require('./user-controller');
let response = null;

// Helpers
const returnErrorResonse = (message, errCode=403) => {
    return response.status(errCode).send({ 
        success: false, 
        message: message
    });
}

const getUserReplyCount = (user) => {
    return Reply.find({"user":user}, (err, res) => {}).count()
}

const getUserStoryCount = (user) => {
    return Story.find({"author":user, "type": "S"}, (err, res) => {}).count()
}

const getUserQuestionCount = (user) => {
    return Story.find({"author":user, "type": "Q"}, (err, res) => {}).count()
}

const getUserFollowerCount = (user) => {
    return Follower.find({"user":user}, (err, res) => {}).count()
}

const getUserByName = (name) => {
	if (!name) {
        return null;
    }

    return User.find({"username": name}, (err, user) => {
        if (err) {
            return null;
        }
        return user;
    });
}


// Exports

let _getUserData = (user) => {
    let replyCount = getUserReplyCount(user);
    let storyCount = getUserStoryCount(user);
    let userData = this.getUser(user);

    return Promise.all([
        userData,
        replyCount,
        storyCount
    ]).then(res => {
        let user = Smart.prepareUser(res[0])

        return {
            user,
            reply: res[1],
            story: res[2]
        }
    }, err => {
        return {
            reply: 0,
            story: 0
        }
    })
}

let _getUserFull = (id) => {
	if (!id) {
        return null;
    }

    return User.findById(id, {"password" : 0}, (err, user) => {
        if (err) {
            return null;
        }
        return user;
    });
}

let _getUser = (id) => {
	if (!id) {
        return null;
    }

    return User.findById(id, (err, user) => {
       //
    });
    
}

let _me = (req, res, next) => {
    try {    
        response = res;
        let {userId} = req;
        if (userId) {
            User.findById(userId, (err, user) => {
                console.log(err, user);
                if (err || !user) {
                    return returnErrorResonse('Authentication failed');
                }
                else {
                    return res.status(200).send(Smart.prepareUser(user));
                }
            });
        }
        else {
            return returnErrorResonse('Authentication failed');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }
}

let _getUserProfile = (req, res) => {
    try {
        response = res;
        if (req.params.user && req.userId) {
            let name = req.params.user;

            User.find({"username": name}, (err, user) => {
                
                if (err || !user || user.length == 0) {
                    return res.status(404).json({success:false, message: "User not found"});
                }

                let userId = user[0]._id;

                Promise.all([
                    
                    getUserStoryCount(userId),
                    getUserReplyCount(userId),
                    getUserQuestionCount(userId),
                    getUserFollowerCount(userId),
                    UserController.isFollowing(userId, req.userId)

                ]).then(stats => {

                    let userObj = Smart.prepareUser(user[0]);

                    userObj.stats = {
                        story : stats[0],
                        question: stats[2],
                        reply : stats[1]
                    }

                    userObj.follower = {
                        following : stats[4],
                        count : stats[3]
                    }
                    
                    return res.status(200).send({
                        success: true,
                        user : userObj
                    })

                }, err => {
                    return returnErrorResonse("Unauthorized access");
                })
            });
        }
        else {
            return returnErrorResonse("Unauthorized access");
        }
    } catch (err) {
        return res.status(500).json({success:false, message: "Unable to get profile"});
    }
}

let _updateUser = (req, res) => {
 try {   
        response = res;
        let user = req.userId;
        let {username, gender, description, image} = req.body;

        if (!Smart.validUser(username)) {
            return returnErrorResonse("Username is not valid");
        }
        
        User.update({"_id": user}, {
            username,
            gender,
            description,
            image
        }, (err, savedUser) => {

            if (err) {
                return returnErrorResonse("Unauthorized access");
            }

            User.findById(user, (err, userData) => {
        
                if (err) {
                    return returnErrorResonse("Unauthorized access");
                }

                return res.status(200).send({
                    success: true,
                    user: Smart.prepareUser(userData)
                });

            });
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }
}


module.exports.getUserData = _getUserData;
module.exports.getUserFull = _getUserFull;
module.exports.getUser = _getUser;
module.exports.me = _me;
module.exports.getUserProfile = _getUserProfile;
module.exports.updateUser = _updateUser;