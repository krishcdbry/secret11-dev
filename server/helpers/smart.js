
let config = require('../config/secret');

module.exports.prepareUser = (data) => {
    let {username, image, description, gender, _id} = data;
    console.log(data);
    return {
        id: _id,
        username,
        image : config.PROFILE_PIC_URL+image, 
        description,
        gender,
    }
}

module.exports.formatDate = (input) => {
    let date = new Date(input);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate();
}