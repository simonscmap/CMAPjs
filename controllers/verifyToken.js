const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

module.exports = (req, res, next) => {
    next();
    
    // try {
    //     const token = req.headers.authorization.split(" ")[1];
    //     const decoded = jwt.verify(token, jwtConfig.secret);
    //     req.userData = decoded;
    //     next();
    // } catch (error) {
    //     return res.status(401).json({
    //         message: 'Token verification failed'
    //     });
    // }
};