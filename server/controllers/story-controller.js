const User = require('../models/users');
const Smart = require('../helpers/smart');
const Story = require('../models/story');
const Answer = require('../models/answer');
const Tag = require('../models/tag');
const Vote = require('../models/vote');
const Reply = require('../models/reply');
const Activity = require('../models/activity');

const Storytag = require('../models/storytag');
const ProfileController = require('./profile-controller');
const TopicController = require('./topic-controller');
const TagController = require('./tag-controller');
const StoryTagController = require('./story-tag-controller');

let response = null;
let currentUserID = null;

// Helpers
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

const getStoryAnswerCount = (story) => {
    return Answer.find({"story":story}, (err, res) => {}).count()
}

const getStoryVoteCount = (story) => {
    return Vote.find({"story":story}, (err, res) => {}).count()
}

const isUserVoted = (story, user) => {
    return Vote.find({"story":story, "user": user}, (err, res) => {}).count()
}

const returnStory = (storyInserted) => {
    return this.getStoryData(storyInserted).then(story => {
        return returnSuccessResonse(story);
    }, err => {
        return returnErrorResonse("Unable to publish", 400);
    })
}

const newStoryActivity = (story, userId) => {
    let timestamp = (new Date()).toUTCString();
    let activity = new Activity({
        type: 'new',
        story,
        user : userId,
        timestamp
    })
    return activity.save((err, res) => {})
}

const newReplyActivity = (story, reply, userId) => {
    let timestamp = (new Date()).toUTCString();;
    let activity = new Activity({
        type: 'reply',
        story,
        reply,
        user : userId,
        timestamp
    })
    return activity.save((err, res) => {})
}

const newVoteActivity = (story, userId) => {
    let timestamp = (new Date()).toUTCString();;
    let activity = new Activity({
        type: 'vote',
        story,
        user : userId,
        timestamp
    })
    return activity.save((err, res) => {})
}

const saveStory = (story, tags, userId) => {
    story.save((err, storyInserted) => {
        if (err) {
            return returnErrorResonse("Unable to publish", 400);
        }
        
        // Save activity
        newStoryActivity(storyInserted._id, userId);

        if (tags && tags.length > 0) {
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


// Export functions 

let _getStoryById = (id) => {
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

let _getStoryData = (story) => {

    let {content, _id, type, timestamp, image, author, title, url, topic} = story;

    let dateTimeString = Smart.formatDate(timestamp);

    let storyObj = {
        title,
        content,
        type,
        timestamp : dateTimeString,
        id : _id,
        image,
        url
    }

    let userData = ProfileController.getUser(author);
    let tags = StoryTagController.getTagByStory(_id);
    let answers = getStoryAnswerCount(_id);
    let replies = getStoryReplyCount(_id);
    let votes = getStoryVoteCount(_id);
    let isVoted = isUserVoted(_id, currentUserID);
    let topicData = TopicController.getTopicById(topic);

    return Promise.all([
        userData,
        tags,
        answers,
        replies,
        votes,
        isVoted,
        topicData
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


        // Topic Data
        let topicObj = values[6];

        storyObj.author = userObj;
        storyObj.answer = answerObj;
        storyObj.reply = replyObj;
        storyObj.upvote = voteObj;
        storyObj.tags = tagsObj;
        storyObj.topic = topicObj;
        
        return storyObj;

    }, err => {
        return null;
    })
}
 
let _publish = (req, res, next) => {
    response = res;
    let timestamp = (new Date()).toUTCString();
    
    if (req.userId) {
        let {userId} = req;
        currentUserID = userId;
        let {tags, content, type, title, image, topic} = req.body;
        let url = "";

        if (type == 'Q') {
            url = content
                    .replace(/[|&;$%@"<>()+,"’'/#*()+=.?]/g, "")
                    .split(" ")
                    .join("-");

            if(content[content.length-1] != '?') {
                content += "?";
            }       
        }
        else {
            if (title.length > 0) {
                url = title
                        .replace(/[|&;$%@"<>()+,"’'/#*()+=.?]/g, "")
                        .split(" ")
                        .join("-")
            }
        }

        let story = new Story({
            content,
            title,
            author : userId,
            topic,
            type,
            active: true,
            timestamp,
            image,
            url
        });

        return saveStory(story, tags, userId)
        
    }
    else {
        return returnErrorResonse("Unauthorized Access")
    }
}

let _storyItem = (req, res) => {
    try {
        response = res;
        if (req.userId) {
            currentUserID = req.userId;
            let user = req.params.user || req.userId;
            let {url} = req.body;
            Story.find({active: true, url: url}, (err, results) => {

                if (err) {
                    throw(err);
                }

                if (results.length < 1) {
                    return res.status(404).send({ 
                        success: false, 
                        message: 'Story not found' 
                    });
                }

                _getStoryData(results[0]).then(values => {

                    return res.status(200).send({ 
                        success: true,
                        _embedded: values 
                    });

                }, err => {
                    throw(err);
                });
                
            });
        }
        else {
            return res.status(403).send({ 
                success: false, 
                message: 'Unauthorized request' 
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Error fetching story"});
    }    
}

let _feed = (req, res, next) => {
    try {
        response = res;
        if (req.userId) {
            currentUserID = req.userId;
            Story.find({active: true}, (err, results) => {
                if (err) {
                    throw(err);
                }
                let storyPromises = results.map(item => {
                    return this.getStoryData(item);
                });
                
                Promise.all(storyPromises).then(values => {
                    return res.status(200).send({ 
                        _embedded: values 
                    });
                }, err => {
                    throw(err);
                });
                
            }).sort({"_id": -1}).limit(15);
        }
        else {
            return res.status(403).send({ 
                success: false, 
                message: 'Unauthorized request' 
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ 
            success: false, 
            message: 'Error fetching feed' 
        });
    }
}

let _feedByUser = (req, res, next) => {
    try {
        response = res;
        if (req.userId) {
            currentUserID = req.userId;
            let user = req.params.user || req.userId;
            Story.find({active: true, author: user}, (err, results) => {

                if (err) {
                    throw(err);
                }

                let storyPromises = results.map(item => {
                    return this.getStoryData(item);
                });
                
                Promise.all(storyPromises).then(values => {

                    return res.status(200).send({ 
                        _embedded: values 
                    });

                }, err => {
                    throw(err);
                });
                
            }).sort({"_id": -1}).limit(15);
        }
        else {
            return res.status(403).send({ 
                success: false, 
                message: 'Unauthorized request' 
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Error fetching feed"});
    }    
}

let _feedByTopic = (req, res, next) => {
    try {
        response = res;
        if (req.userId) {
            currentUserID = req.userId;
            let topic = req.params.topic;
            Story.find({active: true, topic: topic}, (err, results) => {

                if (err) {
                    throw(err);
                }

                let storyPromises = results.map(item => {
                    return this.getStoryData(item);
                });
                
                Promise.all(storyPromises).then(values => {

                    return res.status(200).send({ 
                        _embedded: values 
                    });

                }, err => {
                    throw(err);
                });
                
            }).sort({"_id": -1}).limit(15);
        }
        else {
            return res.status(403).send({ 
                success: false, 
                message: 'Unauthorized request' 
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Error fetching feed"});
    }    
}

let _addReply = (req, res) => {
    try {
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
                throw(err);
            }

            newReplyActivity(story, savedReply._id, userId);

            User.findById(userId, (err, user) => {
                if (err) {
                    throw("Invalid user" + err);
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
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }
}

let _replyFeed = (req, res) => {
    try {
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
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }
 };



 module.exports.upVote = (req, res) => {
    try {
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
            if (err) {
                throw(err);
            }
            if (saved) {
                newVoteActivity(story, userId);

                Promise.resolve(getStoryVoteCount(story)).then(votes => {
                    res.status(200).send({
                        success: true,
                        upvote : {
                            count : votes,
                            voted: true
                        } 
                    })
                }, err => {
                    throw(err);
                })
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }    
}

let _downVote = (req, res) => {
    try {
        response = res;
        let {userId} = req;
        currentUserID = userId;
        let {story} = req.params;

        Vote.find({"story": story, "user": userId}, (err, results) => {
            if (err || !results) {
                throw("Unable to find story")
            }
            let voteData = results[0];
            if (voteData.user == userId) {
                Vote.remove({"_id" : voteData._id}, (err, saved) => {
                    if (err) {
                        throw(err);
                    }
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
                            throw("");
                        });
                    }
                    else {
                        throw("");
                    }
                })
            } else {
                throw("");
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }
}

let _tagFeed = (req, res) => {
    try {  
          if (req.userId) {
                Activity.distinct('story', (err, results) => {
                  if (err) {
                      throw(err);
                  }
            
                  if (!err && results) {
                  
                      let storyPromises = results.map(item => {
                          return this.getStoryById(item);      
                      });

                      Promise.all(storyPromises).then(values => {
                          console.log(values);
                          return res.status(200).send({ 
                              _embedded: values 
                          });
                      }, err => {
                          throw(err);
                      })
                  
                  }
              }).sort({"_id": -1});
          }
    } 
    catch (err) {
      console.error(err);
      return res.status(500).json({success:false, message: "Something gone wrong"});
    }
}


module.exports.getStoryById = _getStoryById;
module.exports.getStoryData = _getStoryData;
module.exports.publish = _publish;
module.exports.feed = _feed;
module.exports.feedByTopic = _feedByTopic;
module.exports.storyItem = _storyItem;
module.exports.feedByUser = _feedByUser;
module.exports.addReply = _addReply;
module.exports.replyFeed = _replyFeed;
module.exports.downVote = _downVote;
module.exports.tagFeed = _tagFeed;


