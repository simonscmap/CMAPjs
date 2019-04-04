const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const UnsafeUser = require('../models/UnsafeUser');

exports.userSignup = async (req, res, next) => {
    // Registers a new user.
    let newUser = new UnsafeUser(req.body);
    await newUser.saveAsNew();
    next();
 }

 exports.userSignin = async (req, res, next) => {
    // Authenticates a user, and generates and sends a JWT.
    res.json(await jwt.sign(req.user, jwtConfig.secret, {expiresIn:'2d'}));
    next();
}
