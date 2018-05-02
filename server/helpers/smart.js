
let config = require('../config/secret');

module.exports.prepareUser = (data) => {
    let {username, image, description, gender, _id} = data;

    return {
        id: _id,
        username,
        image : config.PROFILE_PIC_URL+image, 
        description,
        gender,
    }
}

module.exports.validUser = (user) => {
    let regex = /^[a-zA-Z][a-zA-Z0-9_]{2,}$/
    return regex.test(user);
}

module.exports.formatDate = (input) => {
    let date = new Date(input);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate();
}