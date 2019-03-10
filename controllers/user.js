
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const mdlUser = require('../models/user');



function err2msg(err){
    msg = err.originalError.message;
    errMsg = '';
    duplicateEmailSigniture = "unique index 'idxEmail'. The duplicate";
    duplicateUsernameSigniture = "unique index 'idxUsername'. The duplicate";

    if (msg.includes(duplicateEmailSigniture)) 
        errMsg = 'The entered email has already registered.'
    else if (msg.includes(duplicateUsernameSigniture))
        errMsg = 'The entered username has already registered.'     
    
    return errMsg;    
}


exports.userSignup = (req, res, next) => {
    let newUser = {};
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.userName = req.body.userName;
    newUser.password = req.body.password;
    newUser.email = req.body.email;
 
    mdlUser.addUser(newUser, (err, result) => {
        if (err){
            //console.log(err);
             res.status(500).json({
                success: false,
                message: `Registration failed. ${err2msg(err)}`,
                error: err
                });
         } else {
            res.status(200).json({
                success: true,
                message: 'User registered',
                error: null
            });
        }
    });   
 };



exports.userSignin = (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;

    mdlUser.getUserByUsername(userName, (err, data)=>{
        if (err) throw err;
        // check if username exists        
        if (data.recordset.length < 1) { 
            return res.status(401).json({
                success: false,
                message: 'Authentication failed'
            });
        };
        // check if password is correct 
        mdlUser.comparePassword(password, data.recordset[0].Password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const payload = {FirstName: data.recordset[0].FirstName,
                                UserName: data.recordset[0].UserName,  
                                Email: data.recordset[0].Email  
                                };
                const token = jwt.sign(payload, jwtConfig.secret, {expiresIn: "2h"});
                return res.status(200).json({
                    success: true,
                    message: 'Authentication successful',
                    token: 'Bearer ' + token,
                    expiresIn: "7200"   // 2h = 7200 s
                });

            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication failed'
                });
            };
        });    
    });    
};