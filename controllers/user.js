
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const UnsafeUser = require('../models/UnsafeUser');



// function err2msg(err){
//     // Replaces system error messages with user-understandable error messages.
//     msg = err.originalError.message;
//     errMsg = '';
//     duplicateEmailSigniture = "unique index 'idxEmail'. The duplicate";
//     duplicateUsernameSigniture = "unique index 'idxUsername'. The duplicate";

//     if (msg.includes(duplicateEmailSigniture)) 
//         errMsg = 'The entered email has already registered.'
//     else if (msg.includes(duplicateUsernameSigniture))
//         errMsg = 'The entered username has already registered.'     
    
//     return errMsg;    
// }

exports.userSignup = async (req, res, next) => {
    // Registers a new user.
    try {
        let newUser = new UnsafeUser(req.body);
        await newUser.saveAsNew();
        res.status(200).end(); 
    } 
    catch(error){
        res.status(500).json({error:error})
    }    
 }

 exports.userSignin = (req, res, next) => {
    // Authenticates a user, and generates and sends a JWT.
    try {
        jwt.sign(req.user, jwtConfig.secret, (err, payload) => {
            res.status(200).json(payload);
        })
    } catch(error) {res.status(500).json({error:error})};
}