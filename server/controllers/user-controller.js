const User = require('../models/users');
const Follower = require('../models/follower');

let response = null;
let currentUserID = null;

const returnErrorResonse = (message, errCode=403) => {
    return response.status(errCode).send({ 
        success: false, 
        message: message
    });
}

const returnSuccessResonse = (story) => {
    return response.status(200).send({
        success: true,
        story
    });
}

const getStoryReplyCount = (story) => {
    return Reply.find({"story":story}, (err, res) => {}).count()
}

const _isFollowing = (user, follower) => {
    return Follower.find(
        {
            "user" : user,
            "follower" : follower
        }
    , (err, res) => {}).count();
}

const _userFollowers = (user) => {
    return Follower.find(
        {
            "user" : user
        }
        , (err, res) => {}).count();
}

// Exports

let _feed = (req, res, next) => {
    try {
        response = res;
        currentUserID = req.userId || null;
        Users.find({user: {$not : {_id : currentUserID}}}, (err, results) => {
            if (err) {
                throw(err);
            }
            
        }).sort({"_id": -1}).limit(15);
    
    } catch (err) {
        console.error(err);
        return res.status(500).send({ 
            success: false, 
            message: 'Error fetching feed' 
        });
    }
}

let _followUser = (req, res) => {
    try {
        let {user} = req.body;
        let {userId} = req;

        let timestamp = (new Date()).toUTCString();

        let userFollowerObject = new Follower({
            user,
            follower : userId,
            timestamp
        });

        _isFollowing(user, userId).then(count => {
            if (count == 0) {
                userFollowerObject.save((err, results) => {
                    return res.status(200).json({
                        success: true,
                        message : "Following"
                    })
                })
            }
            else {
                return res.status(403).json({
                    success: false,
                    message : "Already following"
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }
}

let _unfollowUser = (req, res) => {
    try {
        let {user} = req.params;
        let {userId} = req;

        _isFollowing(user, userId).then(count => {
            if (count > 0) {
                Follower.remove({"user" : user, "follower" : userId}, (err, results) => {
                    return res.status(200).json({
                        success: true,
                        message : "Unfollowed"
                    })
                })
            }
            else {
                return res.status(403).json({
                    success: false,
                    message : "Invalid request"
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }
}

module.exports.feed = _feed;
module.exports.followUser = _followUser;
module.exports.unfollowUser = _unfollowUser;
module.exports.isFollowing = _isFollowing;
module.exports.userFollowers = _userFollowers;