let User = require('../models/users');
let Smart = require('../helpers/smart');
let Story = require('../models/story');
let Answer = require('../models/answer');
let Tag = require('../models/tag');
let Vote = require('../models/vote');
let Reply = require('../models/reply');

let Storytag = require('../models/storytag');
let ProfileController = require('./profile-controller');
let TagController = require('./tag-controller');
let StoryTagController = require('./story-tag-controller');
let response = null;
let currentUserID = null;

let returnErrorResonse = (message, errCode=403) => {
    return response.status(errCode).send({ 
        success: false, 
        message: message
    });
}

let returnSuccessResonse = (story) => {
    return response.status(200).send({
        success: true,
        story
    });
}

let getStoryReplyCount = (story) => {
    return Reply.find({"story":story}, (err, res) => {}).count()
}

let getStoryAnswerCount = (story) => {
    return Answer.find({"story":story}, (err, res) => {}).count()
}

let getStoryVoteCount = (story) => {
    return Vote.find({"story":story}, (err, res) => {}).count()
}

let isUserVoted = (story, user) => {
    return Vote.find({"story":story, "user": user}, (err, res) => {}).count()
}

let returnStory = (storyInserted) => {
    return this.getStoryData(storyInserted).then(story => {
        return returnSuccessResonse(story);
    }, err => {
        return returnErrorResonse("Unable to publish", 400);
    })
}

let saveStory = (story, tags, userId) => {
    story.save((err, storyInserted) => {
        if (err) {
            return returnErrorResonse("Unable to publish", 400);
        }

        if (tags.length > 0) {
            tags = tags.split(",");
            TagController.save(tags, userId).then(tagsData => {
                StoryTagController
                    .save(tagsData, storyInserted._id)
                    .then(storyTagData => {
                        return returnStory(storyInserted)
                    }, err => {
                        return returnStory(storyInserted)
                    })

            }, err => {
                return returnStory(storyInserted)
            })
         }
         else {
            return returnStory(storyInserted)
         }
    });
}

module.exports.publish = (req, res, next) => {
    response = res;
    let timestamp = (new Date()).toUTCString();
    
    if (req.userId) {
        let {userId} = req;
        currentUserID = userId;
        let {tags, content, type, title} = req.body;
        
        let story = new Story({
            content,
            title,
            author : userId,
            type,
            active: true,
            timestamp,
        });

        return saveStory(story, tags, userId)
        
    }
    else {
        return returnErrorResonse("Unauthorized Access")
    }
}

module.exports.feed = (req, res, next) => {
    response = res;
    if (req.userId) {
        currentUserID = req.userId;
        Story.find({active: true}, (err, results) => {
            let storyPromises = results.map(item => {
                return this.getStoryData(item);
            });
            
            Promise.all(storyPromises).then(values => {
                return res.status(200).send({ 
                    _embedded: values 
                });
            }, err => {
                return res.status(403).send({ 
                    success: false, 
                    message: 'Error fetching feed' 
                });
            })
        }).sort({"_id": -1}).limit(15);
    }
    else {
        return res.status(403).send({ 
            success: false, 
            message: 'Unauthorized request' 
        });
    }
}

module.exports.feedByUser = (req, res, next) => {
    response = res;
    if (req.userId) {
        currentUserID = req.userId;
        let user = req.params.user || req.userId;
        Story.find({active: true, author: user}, (err, results) => {
            let storyPromises = results.map(item => {
                return this.getStoryData(item);
            });
            
            Promise.all(storyPromises).then(values => {
                return res.status(200).send({ 
                    _embedded: values 
                });
            }, err => {
                return res.status(403).send({ 
                    success: false, 
                    message: 'Error fetching feed' 
                });
            })
        }).sort({"_id": -1}).limit(15);
    }
    else {
        return res.status(403).send({ 
            success: false, 
            message: 'Unauthorized request' 
        });
    }
}

module.exports.getStoryById = (id) => {
   return new Promise((resolve, reject)=> {
            Story.findById(id, (err, results) => {
                if (err || !results) {
                    resolve(null);
                }
                this.getStoryData(results).then(story => {
                    resolve(story);
                }, err => {
                    resolve(null);
                })
            })
   });
}


module.exports.getStoryData = (story) => {

    let {content, _id, type, timestamp, author, title} = story;

    let dateTimeString = Smart.formatDate(timestamp);

    let storyObj = {
        title,
        content,
        type,
        timestamp : dateTimeString,
        id : _id,
    }

    let userData = ProfileController.getUser(author);
    let tags = StoryTagController.getTagByStory(_id);
    let answers = getStoryAnswerCount(_id);
    let replies = getStoryReplyCount(_id);
    let votes = getStoryVoteCount(_id);
    let isVoted = isUserVoted(_id, currentUserID);

    return Promise.all([
        userData,
        tags,
        answers,
        replies,
        votes,
        isVoted
    ]).then(function(values) {

        // Preparing user object

        let userObj = Smart.prepareUser(values[0])

        
        // Preparing Answers
        let answerObj = {
            count: values[2],
            data : []
        };

        // Preparing Answers
        let replyObj = {
            count: values[3],
            data : []
        };

         // Preparing Votes
         let voteObj = {
            count: values[4],
            voted : values[5] > 0 ? true : false
        };

        // Tags Obj
        let tagsObj = values[1] || [];

        storyObj.author = userObj;
        storyObj.answer = answerObj;
        storyObj.reply = replyObj;
        storyObj.upvote = voteObj;
        storyObj.tags = tagsObj;
        
        return storyObj;

    }, err => {
        return null;
    })
}

module.exports.addReply = (req, res) => {
   let reply = req.body.content;
   let story = req.body.story;
   let userId  = req.userId;
   currentUserID = userId;
   let timestamp = (new Date()).toUTCString();

   let replyData = new Reply({
       reply,
       story,
       user : userId,
       timestamp
   })

   replyData.save((err, savedReply) => {
       if (err) {
        return returnErrorResonse("Unable to save", 400);
       }
        User.findById(userId, (err, user) => {
            if (err) {
                return returnErrorResonse("Invalid user", 400);
            }
        
            let replyObj = {
                reply : savedReply.reply,
                user : Smart.prepareUser(user)
            }
            return res.status(200).send({
                success: true,
                reply : replyObj
            })
        })
   })
}

module.exports.replyFeed = (req, res) => {
    let {story} = req.params;
    let {userId} = req.userId;
    currentUserID = userId;
    if (story) {
        Reply.find({"story":story}, (err, results) => {
             if (!err && results) {
                let feed = [];
                let replyPromises = results.map(item => {
                    return new Promise((resolve, reject) => {
                        ProfileController.getUser(item.user)
                            .then(userData => {
                                let user = Smart.prepareUser(userData);
                                let {reply, timestamp, _id} = item;
                                let dateTimeString = Smart.formatDate(timestamp);

                                let replyObj = {
                                    id : _id,
                                    reply,
                                    user,
                                    timestamp : dateTimeString
                                }
                                resolve(replyObj);
                            })
                    })
                })

                Promise.all(replyPromises).then(feed => {
                    return res.status(200).send({
                        success: true,
                        _embedded : feed
                    })
                }, err => {
                    return returnErrorResonse("Unable to fetch feed", 400);
                })
             }
             else {
                return returnErrorResonse("Unable to fetch feed", 400);
             }
        }).sort({"_id": -1}).limit(15);
    }
 };


module.exports.upVote = (req, res) => {
    response = res;
    let {userId} = req;
    currentUserID = userId;
    let {story} = req.body;
    let timestamp = (new Date()).toUTCString();

    let voteObj = new Vote({
        story,
        user : userId,
        timestamp
    })

    voteObj.save((err, saved) => {
        if (saved) {
            Promise.resolve(getStoryVoteCount(story)).then(votes => {
                res.status(200).send({
                    success: true,
                    upvote : {
                        count : votes,
                        voted: true
                    } 
                })
            }, err => {
                return returnErrorResonse("Vote operation failed", 400);
            })
        }
        else {
            return returnErrorResonse("Vote operation failed", 400);
        }
    })
}

module.exports.downVote = (req, res) => {
    response = res;
    let {userId} = req;
    currentUserID = userId;
    let {story} = req.params;

    Vote.find({"story": story, "user": userId}, (err, results) => {
        if (err || !results) {
            return returnErrorResonse("Unable to remove vote", 400);
        }
        let voteData = results[0];
        if (voteData.user == userId) {
            Vote.remove({"_id" : voteData._id}, (err, saved) => {
                if (saved) {
                    Promise.resolve(getStoryVoteCount(voteData.story)).then(votes => {
                        res.status(200).send({
                            success: true,
                            upvote : {
                                count : votes,
                                voted: false
                            } 
                        })
                    }, err => {
                        return returnErrorResonse("Vote operation failed", 400);
                    });
                }
                else {
                    return returnErrorResonse("Unable to remove vote", 400);
                }
            })
        } else {
            return returnErrorResonse("Unauthorized access", 403);
        }
    })
}