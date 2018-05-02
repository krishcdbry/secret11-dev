let jwt = require('jsonwebtoken');
let config = require('../config/secret');
let security = require("../helpers/security");

let firewall = (req, res, next) => {
    if (!req.headers['x-access-token']) {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }
    
    let originalToken = req.headers['x-access-token'];
    let token = security.decryptToken(originalToken);
    if (!token) {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'Failed to authenticate token.' 
            });
        }

        req.userId = decoded.id;
        next();
    });
}



module.exports = firewall;