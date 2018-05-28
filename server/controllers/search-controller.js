const unirest = require('unirest');
const User = require('../models/users');

const Smart = require('../helpers/smart');

let _searchGlobal = (req, res) => {
    try {
        let searchQuery = req.params.key;
        User.find({
            "username": {
                "$regex": "^"+searchQuery, 
                "$options": "i"
            }}, (err, results) => {

                if (err) {
                    throw(err);
                }
                
                if (results && results.length > 0) {
                    let users = results.map(item => {
                        return Smart.prepareUser(item);
                    })

                    return res.status(200).json({
                        success: true,
                        info : {
                            key : searchQuery,
                            type: "text"
                        },
                        _embedded : users
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        info : {
                            key : searchQuery,
                            type: "text"
                        },
                        _embedded : []
                    })
                }
        });
    }
    catch (err) {
        return res.status(500).json({success:false, message: "Something gone wrong"});
    }
}

let _searchPic = (req, res) => {
    let {key} = req.params;
   unirest.get("https://contextualwebsearch-search-image-v1.p.mashape.com/api/Search/ImageSearchAPI?count=50&q="+key+"&autocorrect=true")
   .header("X-Mashape-Key", "3e0LEreKExmshmY7luWewquhWNbrp1GSrLnjsnrVzaLyVv9KtJ")
    .header("X-Mashape-Host", "contextualwebsearch-search-image-v1.p.mashape.com")
    .end(result => {
        if (result.statusCode) {
            return res.status(200).json({
                success: true,
                info : {
                    key,
                    type : "image"
                },
                _embedded : (result.body) ? result.body.value : []
            })
        }
    });
}

module.exports.searchPic = _searchPic;
module.exports.searchGlobal = _searchGlobal;