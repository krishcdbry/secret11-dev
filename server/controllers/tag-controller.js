let Tag = require('../models/tag');
let Storytag = require('../models/storytag');
let Story = require('../controllers/story-controller');
let response = null;

let returnErrorResonse = (message, errCode=403) => {
    return response.status(errCode).send({ 
        success: false, 
        message: message
    });
}

module.exports.save = (tags, userId) => {
    let timestamp = (new Date()).toUTCString();
    if (tags.length > 0) {
        let tagPromises = tags.map(item => {
            let tag = new Tag({
                name : item,
                timestamp,
                active: true,
                count : 0,
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

module.exports.getTagById = (id) => {
    return Tag.findById(id, (err, results) => {
        if (!err && results && results.length > 0) {
             return results;
        }
        else {
            return null;
        }
    }); 
}

module.exports.getStoriesByTag = (id) => {
    return Storytag.find({"tag" : id}, (err, results) => {}).count()
}

module.exports.tagData = (req, res) => {
    try {
        response = res;
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
            
                this.getStoriesByTag(_id).then(storyCount => {
                
                    let tagData = {
                        name : name,
                        id : _id,
                        stories: storyCount
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
                throw("bad request - 73 Line");
            }     
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }    
}

module.exports.tagFeed = (req, res) => {
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

module.exports.getTags = (req, res) => {
   // try {
        Tag.find({}, {name:1, count:1}, (err, results) => {
            // if (err) {
            //     throw(err);
            // }
            if (results) {
                return res.status(200).send({
                    _embedded : results
                })
            }
        }).sort({"count" : -1}).limit(10);
   // }
    // catch (err) {
    //     console.error(err);
    //     return res.status(500).json({success:false, message: "Something gone wrong"});
    // }
}