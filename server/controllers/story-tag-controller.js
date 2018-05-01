let Tag = require('../models/tag');
let Storytag = require('../models/storytag');
let TagController = require('../controllers/tag-controller');

module.exports.save = (tags, story) => {
    let timestamp = (new Date()).toUTCString();
    if (tags.length > 0) {
            let tagPromises = tags.map(item => {
            let storyTag = new Storytag({
                story,
                tag : item._id
            })
            return new Promise((resolve, reject) => {
                Storytag.find({"story" : story, "tag" : item._id}, (err, results) => {
                    if (results.length == 0) {
                        storyTag.save((err, insertedTag) => {
                            if (!err) {
                                resolve(insertedTag)
                            } else {
                                resolve();
                            }
                        })
                    }
                    else {
                        resolve(results[0]);
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

module.exports.getTagByStory = (story) => {
    return new Promise((resolve, reject) => { 
        Storytag.find({"story" : story}, (err, results) => {
            if (!err || results.length > 0) {
                let storyTagPromises = results.map(item => {
                    return new Promise((res, rej) => {
                        TagController.getTagById(item.tag).then(tagRes => {
                            let tagObj = {    
                                name :tagRes.name,
                                id : tagRes._id
                            }
                            res(tagObj);
                        });     
                    })
                })

                Promise.all(storyTagPromises).then(res => {
                    resolve(res);
                }, err => {
                    resolve(null);
                })
            }
            else {
                resolve(null);
            }
        })
    });
    
}

