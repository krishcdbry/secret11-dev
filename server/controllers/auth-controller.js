const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/secret');
const profile = require('./profile-controller');
const smart = require('../helpers/smart');
const security = require("../helpers/security");
const User = require('../models/users');

const encryptPassword = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
 	hash.digest('hex');
    return hash.digest('hex');
};

let _signup = (req, res) => {
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
			image : 'user-profile-'+(Math.floor(Math.random()*209)+1)+'.png',
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

let _login = (req, res) => {
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

let _logout = (req, res) => {
	return res.status(200).send({ success: true, message: "successfully loggedout", token: null });
}

module.exports.signup = _signup;
module.exports.login = _login;
module.exports.logout = _logout;