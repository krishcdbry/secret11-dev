const Tag = require('../models/tag');
const TagFollower = require('../models/tagfollower');
const Storytag = require('../models/storytag');
const Story = require('../controllers/story-controller');

let response = null;

// Helpers
const returnErrorResonse = (message, errCode=403) => {
    return response.status(errCode).send({ 
        success: false, 
        message: message
    });
}

// Exports 
let _save = (tags, userId) => {
    let timestamp = (new Date()).toUTCString();
    if (tags.length > 0) {
        let tagPromises = tags.map(item => {
            let tag = new Tag({
                name : item,
                timestamp,
                active: true,
                count : 1,
                user: userId
            })
            return new Promise((resolve, reject) => {
                Tag.find({"name" : item}, (err, results) => {
                    if (!err && results.length == 0) {
                        tag.save((err, insertedTag) => {
                            if (!err) {
                                resolve(insertedTag)
                            } else {
                                resolve();
                            }
                        })
                    }
                    else {
                        Tag.update({"name": item}, {
                            count : Number(results[0].count)+1
                        }, (err, res) => {
                            resolve(results[0])
                        })
                    }
                })
            })
        });
        
        return Promise.all(tagPromises).then(tags => {
            return tags;
        }, err => {
            return [];
        })
    }
}

let _getTagById = (id) => {
    return Tag.findById(id, (err, results) => {
        if (!err && results && results.length > 0) {
             return results;
        }
        else {
            return null;
        }
    }); 
}

let _getStoriesByTag = (id) => {
    return Storytag.find({"tag" : id}, (err, results) => {}).count()
}

let _isFollowing = (tag, follower) => {
    return TagFollower.find({"tag" : tag, "follower" : follower}, (err, results) => {}).count()
}

let _tagFollowerCount = (tag) => {
    return TagFollower.find({"tag" : tag}, (err, results) => {}).count()
}

let _tagData = (req, res) => {
    try {
        response = res;
        let {userId} = req;
        let {name} = req.params;
        
        if (!name) {
            return returnErrorResonse("Bad Request", 400);
        }

        Tag.findOne({"name" : name}, (err, results) => {
            if (err) {
                throw(err);
            }
            if (!err && results) {
                let {name, _id} = results;
            
                let storyCount = _getStoriesByTag(_id);
                let followerCount = _tagFollowerCount(_id);
                let checkFollower = _isFollowing(_id, userId);

                Promise.all([
                    storyCount,
                    followerCount,
                    checkFollower
                ]).then(values => {

                    let tagData = {
                        name : name,
                        id : _id,
                        stories: values[0],
                        follower : {
                            count : values[1],
                            following : values[2]
                        }
                    }
                
                    return res.status(200).send({
                        success: true,
                        tag : tagData
                    })
                }, err => {
                    throw(err);
                })
            }   
            else {
                return res.status(404).json({success:false, message: "Tag not found"});
            }    
        })
    } catch (err) {
        //console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }    
}

let _tagFeed = (req, res) => {
  try {  
        let {tag} = req.params;
        if (tag) {
            Storytag.find({"tag":tag}, (err, results) => {
                if (err) {
                    throw(err);
                }
                if (!err && results) {
                
                    let storyPromises = results.map(item => {
                        return Story.getStoryById(item.story);      
                    });
                    
                    Promise.all(storyPromises).then(values => {
                        return res.status(200).send({ 
                            _embedded: values 
                        });
                    }, err => {
                        throw(err);
                    })
                
                }
            }).sort({"_id": -1}).limit(15);
        }
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({success:false, message: "Something gone wrong"});
  }
}

let _getTags = (req, res) => {
    try {
        Storytag.aggregate(
            [
                { $group: { _id: "$tag" , count: { $sum: 1 } } }, 
                { $lookup: { from: "tags", localField: "_id", foreignField: "_id", as: "tagdata" }},
                { $unwind : "$tagdata" },
                { $project: { "_id": 1, "count":1, "name": "$tagdata.name" } },
                { $limit: 10 },
                { $sort : {"count" : -1}}
            ]
        , (err, results) => {
            if (err) {
                throw(err);
            }
            if (results) {
                return res.status(200).send({
                    _embedded : results
                })
            }
        })
   }
    catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }
}

let _followTag = (req, res) => {
    try {
        let {tag} = req.body;
        let {userId} = req;

        let timestamp = (new Date()).toUTCString();

        let TagFollowerObject = new TagFollower({
            tag,
            follower : userId,
            timestamp
        });

        _isFollowing(tag, userId).then(count => {
            if (count == 0) {
                TagFollowerObject.save((err, results) => {
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

let _unfollowTag = (req, res) => {
    try {
        let {tag} = req.params;
        let {userId} = req;

        _isFollowing(tag, userId).then(count => {
            if (count > 0) {
                TagFollower.remove({"tag" : tag, "follower" : userId}, (err, results) => {
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

let _getTagFollowers = () => {

}

module.exports.save = _save;
module.exports.getTagById = _getTagById;
module.exports.getStoriesByTag = _getStoriesByTag;
module.exports.isFollowing = _isFollowing;
module.exports.getFollowerCount = _tagFollowerCount;
module.exports.tagData = _tagData;
module.exports.tagFeed = _tagFeed;
module.exports.getTags = _getTags;
module.exports.followTag = _followTag;
module.exports.unfollowTag = _unfollowTag;
module.exports.getTagFollowers = _getTagFollowers;