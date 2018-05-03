let User = require('../models/users');
let Story = require('../models/story');
let Reply = require('../models/reply');
let Smart = require('../helpers/smart');
let response = null;

let returnErrorResonse = (message, errCode=403) => {
    return response.status(errCode).send({ 
        success: false, 
        message: message
    });
}

let getUserReplyCount = (user) => {
    return Reply.find({"user":user}, (err, res) => {}).count()
}

let getUserStoryCount = (user) => {
    return Story.find({"author":user, "type": "S"}, (err, res) => {}).count()
}

let getUserQuestionCount = (user) => {
    return Story.find({"author":user, "type": "Q"}, (err, res) => {}).count()
}

let getUserByName = (name) => {
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

module.exports.getUserData = (user) => {
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

module.exports.getUserFull = (id) => {
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

module.exports.getUser = (id) => {
	if (!id) {
        return null;
    }

    return User.findById(id, (err, user) => {
       //
    });
    
}

module.exports.me = (req, res, next) => {
    try {    
        response = res;
        if (req.userId) {
            console.log(req.userId);
            User.findById(req.userId, (err, user) => {
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

module.exports.getUserProfile = (req, res) => {
    try {
        response = res;
        if (req.params.user && req.userId) {
            let name = req.params.user;

            User.find({"username": name}, (err, user) => {
                
                if (err || !user || user.length == 0) {
                    throw("Invalud user")
                }

                let userId = user[0]._id;

                Promise.all([
                    
                    getUserStoryCount(userId),
                    getUserReplyCount(userId),
                    getUserQuestionCount(userId)

                ]).then(stats => {

                    let userObj = Smart.prepareUser(user[0]);

                    userObj.stats = {
                        story : stats[0],
                        question: stats[2],
                        reply : stats[1]
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

module.exports.updateUser = (req, res) => {
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