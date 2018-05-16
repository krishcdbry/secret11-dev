let unirest = require('unirest');

module.exports.search = (req, res) => {
    let {key} = req.params;
   unirest.get("https://contextualwebsearch-search-image-v1.p.mashape.com/api/Search/ImageSearchAPI?count=50&q="+key+"&autocorrect=true")
   .header("X-Mashape-Key", "3e0LEreKExmshmY7luWewquhWNbrp1GSrLnjsnrVzaLyVv9KtJ")
    .header("X-Mashape-Host", "contextualwebsearch-search-image-v1.p.mashape.com")
    .end(result => {
        console.log(result.body);
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

