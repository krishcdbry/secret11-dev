const Topic = require('../models/topic');
const Story = require('../controllers/story-controller');

let response = null;

// Helpers
const returnErrorResonse = (message, errCode=403) => {
    return response.status(errCode).send({ 
        success: false, 
        message: message
    });
}

let _getTopicById = (id) => {
    return Topic.findById(id, (err, results) => {
        if (!err && results && results.length > 0) {
             return results;
        }
        else {
            return null;
        }
    });
}

// Exports 
let _getTopics = (req, res) => {
    try {  
        Topic.find({}, (err, results) => {
            if (err) {
                throw(err);
            }
            if (!err && results) {
        
                return res.status(200).send({ 
                    _embedded: results 
                });
                
            }
        }) 
  } 
  catch (err) {
    return res.status(500).json({success:false, message: "Something gone wrong"});
  }
}

module.exports.topics = _getTopics;
module.exports.getTopicById = _getTopicById;
