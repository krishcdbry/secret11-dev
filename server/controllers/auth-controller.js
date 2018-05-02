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
	try {
		let {username, password, gender} = req.body;
		let hashedPassword = bcrypt.hashSync(password, 8);

		if (!smart.validUser(username)) {
			return res.status(403).json({
				success:false, 
				message: "username is not valid, Valid characters a-z, A-Z, 0-9, _"
			});
		}

		let user = new User({
			username,
			password : hashedPassword,
			image : 'user-profile-'+Math.floor(Math.random()*209)+1,
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

					return res.status(200).json({ 
						success: true, 
						token: security.encryptToken(token), 
						userData: userObject 
					});
				});
			} else {
				return res.status(200).json({
					success:false, 
					message: "username is not available"
				});
			}
		})
	} catch (err) {
		console.error(err);
		return res.status(500).json({success:false, message: "Something gone wrong"});
	}
};

module.exports.login = (req, res) => {
	try {
		let {username, password} = req.body;
		User.find({
			"username" : username
		}, (err, results) => {
			if (results && results.length > 0) {
					let userData = results[0]

					let passwordIsValid = bcrypt.compareSync(password, userData.password);

					if (!passwordIsValid) {
						return res.status(403).json({success:false, message: "Invalid login attempt"});
					}
				
					let token = jwt.sign({ id: userData._id }, config.secret, {
						expiresIn: 86400 // expires in 24 hours
					});

					let userObject = smart.prepareUser(userData)

					return res.status(200).json({ 
						success: true, 
						token: security.encryptToken(token), 
						userData: userObject 
					});
				
			} else {
				return res.status(403).json({success:false, message: "Not a valid account"});
			}
		})
	} catch (err) {
		console.error(err);
		return res.status(500).json({success:false, message: "Something gone wrong"});
	}	
};

module.exports.logout = (req, res) => {
	return res.status(200).send({ success: true, message: "successfully loggedout", token: null });
}