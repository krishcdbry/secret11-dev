let crypto = require('crypto');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let config = require('../config/secret');
let profile = require('./profile-controller');
let smart = require('../helpers/smart');
let security = require("../helpers/security");

let encryptPassword = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
 	hash.digest('hex');
    return hash.digest('hex');
};

let User = require('../models/users');

module.exports.signup = (req, res) => {
	let {username, password, gender} = req.body;
	let hashedPassword = bcrypt.hashSync(password, 8);
	let user = new User({
		username,
		password : hashedPassword,
		image : 'user-'+Math.floor(Math.random()*49)+1,
		description: "",
		gender: gender,
		_enabled : true,
	});
	User.find({"username" : username}, (err, results) => {
		if (results && results.length == 0) {
			user.save((err, userInserted) => {

				let userObject = smart.prepareUser(userInserted)

				let token = jwt.sign({ id: userInserted._id }, config.secret, {
					expiresIn: 86400 // expires in 24 hours
				});

				res.status(200).json({ 
					auth: true, 
					token: security.encryptToken(token), 
					userData: userObject 
				});
			});
		} else {
			res.json({auth:false, message: "username is not available"});
		}
	})
};

module.exports.login = (req, res) => {
	let {username, password} = req.body;
	User.find({
		"username" : username
	}, (err, results) => {
		if (results && results.length > 0) {
				let userData = results[0]

				let passwordIsValid = bcrypt.compareSync(password, userData.password);

				if (!passwordIsValid) {
					res.status(403).json({auth:false, message: "Invalid login attempt"});
				}
			
				let token = jwt.sign({ id: userData._id }, config.secret, {
					expiresIn: 86400 // expires in 24 hours
				});

				let userObject = smart.prepareUser(userData)

				res.status(200).json({ 
					auth: true, 
					token: security.encryptToken(token), 
					userData: userObject 
				});
			
		} else {
			res.status(403).json({auth:false, message: "Not a valid account"});
		}
	})
};

module.exports.logout = (req, res) => {
	return res.status(200).send({ auth: true, message: "successfully loggedout", token: null });
}